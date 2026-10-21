import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
export function openDatabase(path: string) {
  if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec(`PRAGMA journal_mode=WAL;PRAGMA busy_timeout=5000;
 CREATE TABLE IF NOT EXISTS quotes(id TEXT PRIMARY KEY,request_key TEXT UNIQUE NOT NULL,payload TEXT NOT NULL,estimate INTEGER NOT NULL,created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS blocked_slots(date TEXT NOT NULL,time TEXT NOT NULL,PRIMARY KEY(date,time));`);
  return db;
}
export type QuoteDatabase = ReturnType<typeof openDatabase>;
