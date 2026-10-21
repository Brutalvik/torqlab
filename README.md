# TorqLab Automotive

React + TypeScript, Redux Toolkit, Tailwind CSS and Three.js frontend with an Express + TypeScript quote API. Requires Node.js 24.4+ (uses built-in SQLite).

## Local development

```sh
npm install
npm run dev
```

Starts the frontend at http://127.0.0.1:5173 and the API at http://127.0.0.1:3001. Vite proxies /api to Express. Optional environment settings are documented in .env.example; copy it to .env if needed. No external service or email account is required.

## Quote requests

The form requires email, phone, vehicle information, neighbourhood, preferred date/time and contact consent. Notes are optional (2,000 characters maximum). A successful response saves a local request and displays a reference number; it does not send email/SMS or confirm/reserve an appointment. No email delivery is currently implemented, per the local-only scope.

Requests are stored in server/data/torqlab.sqlite. The data directory and .env are ignored by Git and are never served publicly. Back up this database and protect its filesystem access. There is no public endpoint for reading customer requests.

```sh
npm run quotes:list
npm run slots -- block 2026-11-02 09:00
npm run slots -- unblock 2026-11-02 09:00
```

The list command prints the latest 100 requests, including customer details, for local administration. Do not share its output publicly. Blocking is manual; there is no staff calendar integration yet. Quote requests do not consume capacity. Block occupied appointment start times after confirming them with the customer; longer jobs require blocking all affected starts.

## Calendar rules

- Every day, 9:00 AM through 8:00 PM inclusive, in 30-minute start-time intervals (23 choices).
- Dates are limited to today through 90 days ahead.
- Past times and manually blocked slots are excluded. The API rechecks availability during submission.
- Times use Calgary/Alberta time, regardless of the visitor's device timezone. Current/future scheduling uses UTC-6 explicitly to avoid stale client timezone databases following Alberta's permanent-time change in November 2026. Reference: https://www.alberta.ca/albertas-new-time-system-abt
- These are requested start times, not a promise that a job lasts 30 minutes or finishes by 8 PM.

## API

- GET /api/health
- GET /api/availability?date=YYYY-MM-DD
- POST /api/quotes

The shared Zod schema in shared/quote.ts defines the request. The server calculates prices from the service catalogue, rejects invalid fields, limits request sizes and submission frequency, and supports idempotent retries using requestId. It returns no saved contact details. Validation, availability, throttling and storage failures use JSON error responses.

## Checks and production build

```sh
npm test
npm run typecheck
npm run build
```

The build compiles the server into dist-server/ and the frontend into dist/. To serve both with Express, set NODE_ENV=production and run npm start. HOST defaults to 127.0.0.1 and PORT to 3001; configure these explicitly for your eventual hosting environment. HTTPS, mail delivery, staff authentication, backups, retention policies and confirmed-booking capacity management must be configured before public operation. Rate limits currently use in-process memory and are suitable for this single-process local app.

## Project structure

- src/main.tsx: landing page and service selection.
- src/store.ts and src/hooks.ts: typed Redux state and hooks.
- src/QuoteRequestForm.tsx: request submission and receipt.
- src/AppointmentPicker.tsx: calendar and time selection.
- src/CarViewer.tsx: interactive rotating car, randomly selected paint on load.
- src/styles.css: shared theme and responsive glass styling.
- shared/: validation and scheduling rules.
- server/: Express application, SQLite storage, local management and integration tests.
- src/Terms.tsx and LEGAL_REVIEW.md: draft service terms and outstanding legal review items.

## Supplied model

The supplied model embeds Ddiaz Design attribution and a CC BY-NC-SA 4.0 licence. Attribution appears in the terms page and public/model-attribution.txt. Obtain appropriate commercial rights or replace the model before commercial publication.

The preferred date/time control opens a native modal dialog with a blurred backdrop. Draft selections apply only on Confirm; Cancel/Escape preserve the committed value. Mouse devices use public/cursors/torqlab-pointer.png; text inputs retain their editing cursor. Touch devices use normal touch behaviour.


## Vercel frontend deployment

vercel.json builds the Vite frontend into dist and serves /terms through index.html. Deploy the latest main commit, not the older a629bda deployment that predates the Luxon parameter-type fix. Enable Web Analytics in the Vercel project dashboard; the root React Analytics component covers landing and terms pages, and removes query strings and hash fragments from analytics event URLs. No quote field values or custom events are sent to analytics. App version is sourced from package.json.

This Vercel configuration deploys the frontend only. The Express API and SQLite remain local as requested; production quote requests need a separately hosted API and durable storage before they can function on the public site.

