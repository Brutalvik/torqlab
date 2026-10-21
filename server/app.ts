import express, { type ErrorRequestHandler } from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { randomUUID, createHash } from "node:crypto";
import { DateTime } from "luxon";
import { quoteSchema, type QuoteReceipt } from "../shared/quote.js";
import {
  availableTimes,
  localToday,
  TIME_ZONE,
  SCHEDULE_ZONE,
  validDate,
  timeSlots,
} from "../shared/schedule.js";
import { allServices } from "../src/data.js";
import type { QuoteDatabase } from "./database.js";
export function createApp(
  db: QuoteDatabase,
  {
    now = () => DateTime.now(),
    staticDirectory,
  }: { now?: () => DateTime; staticDirectory?: string } = {},
) {
  const app = express();
  app.disable("x-powered-by");
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use("/api", (_req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
  });
  app.use(express.json({ limit: "16kb" }));
  app.use(
    "/api",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 120,
      standardHeaders: "draft-8",
      legacyHeaders: false,
      message: { error: "Too many requests. Please try again shortly." },
    }),
  );
  const blocked = (date: string) =>
    new Set(
      (
        db.prepare("SELECT time FROM blocked_slots WHERE date=?").all(date) as {
          time: string;
        }[]
      ).map((r) => r.time),
    );
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", delivery: "local" });
  });
  app.get("/api/availability", (req, res) => {
    const date =
      typeof req.query.date === "string" ? req.query.date : localToday(now());
    if (!validDate(date, now())) {
      res
        .status(400)
        .json({ error: "Choose a valid date within the next 90 days." });
      return;
    }
    res.json({
      date,
      timezone: TIME_ZONE,
      slots: availableTimes(date, blocked(date), now()),
      today: localToday(now()),
      maxDate: now().setZone(SCHEDULE_ZONE).plus({ days: 90 }).toISODate(),
    });
  });
  app.post(
    "/api/quotes",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 10,
      standardHeaders: "draft-8",
      legacyHeaders: false,
      message: {
        error: "Too many quote requests. Please try again in 15 minutes.",
      },
    }),
    (req, res) => {
      const parsed = quoteSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "Please check the required fields.",
          fields: parsed.error.flatten().fieldErrors,
        });
        return;
      }
      const input = parsed.data;
      const existing = db
        .prepare("SELECT id,payload,estimate FROM quotes WHERE request_key=?")
        .get(input.requestId) as
        { id: string; payload: string; estimate: number } | undefined;
      const payload = JSON.stringify(input);
      const same = (a: string, b: string) =>
        createHash("sha256").update(a).digest("hex") ===
        createHash("sha256").update(b).digest("hex");
      const receipt = (id: string, estimate: number): QuoteReceipt => ({
        id,
        status: "requested",
        delivery: "local",
        estimate,
        currency: "CAD",
        date: input.date,
        time: input.time,
        timezone: TIME_ZONE,
      });
      if (existing) {
        if (!same(existing.payload, payload)) {
          res.status(409).json({
            error:
              "This request was already used. Refresh the form before sending another.",
          });
          return;
        }
        res.json(receipt(existing.id, existing.estimate));
        return;
      }
      if (
        !timeSlots.includes(input.time) ||
        !availableTimes(input.date, blocked(input.date), now()).includes(
          input.time,
        )
      ) {
        res.status(409).json({
          error:
            "That time is no longer available. Choose another date or time.",
        });
        return;
      }
      const service = allServices.find((s) => s.id === input.service)!;
      const estimate =
        service.price *
        (["b1", "b2"].includes(input.service) ? input.axles : 1);
      const id = randomUUID();
      db.prepare(
        "INSERT INTO quotes(id,request_key,payload,estimate,created_at) VALUES(?,?,?,?,?)",
      ).run(id, input.requestId, payload, estimate, now().toUTC().toISO()!);
      res.status(201).json(receipt(id, estimate));
    },
  );
  if (staticDirectory) {
    app.use(express.static(staticDirectory));
    app.get(["/", "/terms"], (_req, res) =>
      res.sendFile("index.html", { root: staticDirectory }),
    );
  }
  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "API endpoint not found." });
  });
  const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    const status =
      error?.status === 413 ? 413 : error instanceof SyntaxError ? 400 : 500;
    res.status(status).json({
      error:
        status === 413
          ? "Request is too large."
          : status === 400
            ? "Invalid JSON request."
            : "Unable to save your request. Please try again.",
    });
  };
  app.use(errorHandler);
  return app;
}
