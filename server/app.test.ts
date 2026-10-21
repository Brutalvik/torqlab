import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DateTime } from "luxon";
import { createApp } from "./app.js";
import { openDatabase } from "./database.js";
import { availableTimes, slotInstant, timeSlots } from "../shared/schedule.js";
const now = DateTime.fromISO("2026-10-21T10:15", { zone: "America/Edmonton" });
function input() {
  return {
    requestId: randomUUID(),
    service: "b2",
    vehicleType: "Car / Sedan",
    vehicle: "2020 Honda Civic",
    neighbourhood: "Beltline",
    axles: 2,
    email: "test@example.com",
    phone: "403 555 0123",
    notes: "Test request",
    date: "2026-10-22",
    time: "09:00",
    consent: true,
  };
}
async function fixture(
  run: (url: string, db: ReturnType<typeof openDatabase>) => Promise<void>,
) {
  const db = openDatabase(":memory:");
  const server = createApp(db, { now: () => now }).listen(0, "127.0.0.1");
  await new Promise<void>((r) => server.once("listening", r));
  const address = server.address();
  assert(address && typeof address !== "string");
  try {
    await run(`http://127.0.0.1:${address.port}`, db);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((e) => (e ? reject(e) : resolve())),
    );
    db.close();
  }
}
const send = (url: string, body: unknown) =>
  fetch(`${url}/api/quotes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
test("Availability uses Calgary time, hides past and blocked slots and includes 8pm", async () => {
  await fixture(async (url, db) => {
    db.prepare("INSERT INTO blocked_slots(date,time) VALUES(?,?)").run(
      "2026-10-21",
      "11:00",
    );
    const r = await fetch(`${url}/api/availability?date=2026-10-21`);
    assert.equal(r.status, 200);
    const b = await r.json();
    assert.equal(b.timezone, "America/Edmonton");
    assert.equal(b.slots[0], "10:30");
    assert(!b.slots.includes("11:00"));
    assert.equal(b.slots.at(-1), "20:00");
    assert.equal(
      (await fetch(`${url}/api/availability?date=2026-02-30`)).status,
      400,
    );
    assert.equal(
      (await fetch(`${url}/api/availability?date=2027-12-01`)).status,
      400,
    );
  });
});
test("Saves a quote locally with a server-calculated estimate, not a booking", async () => {
  await fixture(async (url, db) => {
    const body = input();
    const r = await send(url, body);
    assert.equal(r.status, 201);
    const b = await r.json();
    assert.equal(b.estimate, 260);
    assert.equal(b.delivery, "local");
    assert.equal(b.status, "requested");
    assert(b.id);
    const saved = db.prepare("SELECT payload FROM quotes WHERE id=?").get(b.id);
    assert(saved);
    assert.equal(JSON.parse(String(saved.payload)).email, body.email);
    const times = await (
      await fetch(`${url}/api/availability?date=${body.date}`)
    ).json();
    assert(
      times.slots.includes(body.time),
      "a quote request does not reserve an appointment",
    );
  });
});
test("Retries are idempotent; changed payload with the same key is rejected", async () => {
  await fixture(async (url, db) => {
    const body = input();
    const first = await (await send(url, body)).json();
    const retry = await send(url, body);
    assert.equal(retry.status, 200);
    assert.equal((await retry.json()).id, first.id);
    assert.equal(
      db.prepare("SELECT COUNT(*) AS total FROM quotes").get()?.total,
      1,
    );
    assert.equal(
      (await send(url, { ...body, notes: "Different" })).status,
      409,
    );
  });
});
test("Rejects missing contacts, invalid phone, missing consent and injected pricing", async () => {
  await fixture(async (url, db) => {
    for (const change of [
      { email: "" },
      { phone: "abc" },
      { consent: false },
      { estimate: 1 },
      { notes: "a".repeat(2001) },
      { website: "spam.example" },
    ])
      assert.equal((await send(url, { ...input(), ...change })).status, 400);
    assert.equal(
      db.prepare("SELECT COUNT(*) AS total FROM quotes").get()?.total,
      0,
    );
  });
});
test("Revalidates past, off-hours, non-half-hour and blocked times on submission", async () => {
  await fixture(async (url, db) => {
    db.prepare("INSERT INTO blocked_slots(date,time) VALUES(?,?)").run(
      "2026-10-22",
      "09:00",
    );
    for (const change of [
      { time: "08:30" },
      { time: "20:30" },
      { time: "09:15" },
      { date: "2026-10-20" },
      { date: "2026-10-22", time: "09:00" },
    ])
      assert.equal((await send(url, { ...input(), ...change })).status, 409);
  });
});
test("Rate limits submission and handles malformed requests", async () => {
  await fixture(async (url) => {
    for (let i = 0; i < 10; i++)
      assert.equal((await send(url, {})).status, 400);
    assert.equal((await send(url, {})).status, 429);
    assert.equal((await fetch(`${url}/api/unknown`)).status, 404);
    const malformed = await fetch(`${url}/api/quotes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{broken",
    });
    assert.equal(malformed.status, 400);
  });
});
test("Local database persists across reopen", () => {
  const folder = mkdtempSync(join(tmpdir(), "torqlab-test-"));
  const path = join(folder, "quotes.sqlite");
  try {
    let db = openDatabase(path);
    db.prepare("INSERT INTO quotes VALUES(?,?,?,?,?)").run(
      "test",
      "key",
      "{}",
      89,
      now.toISO()!,
    );
    db.close();
    db = openDatabase(path);
    assert.equal(
      db.prepare("SELECT estimate FROM quotes WHERE id=?").get("test")
        ?.estimate,
      89,
    );
    db.close();
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});
test("Alberta permanent UTC-6 conversion and all 23 half-hour choices", () => {
  assert.equal(timeSlots.length, 23);
  assert.equal(slotInstant("2026-10-31", "09:00").toUTC().hour, 15);
  assert.equal(slotInstant("2026-11-01", "09:00").toUTC().hour, 15);
  assert.equal(availableTimes("2026-10-22", new Set(), now).length, 23);
});
