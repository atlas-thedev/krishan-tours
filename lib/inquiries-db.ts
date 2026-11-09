import { chmodSync, mkdirSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

export type InquiryStatus = "new" | "contacted" | "confirmed" | "archived";

export type InquiryRecord = {
  id: string;
  receivedAt: string;
  updatedAt: string;
  type: "contact" | "planner";
  status: InquiryStatus;
  name: string;
  email: string;
  phone: string;
  month: string;
  message: string;
  timing: string;
  duration: string;
  group: string;
  interests: string[];
  pace: string;
  stay: string;
  budget: string;
  country: string;
  ip: string;
  adminNote: string;
  /** Site language the traveller used (en, de, fr, ru…). */
  language: string;
  /** Page the form was sent from. */
  page: string;
};

export type NewInquiry = Omit<InquiryRecord, "updatedAt" | "status" | "adminNote">;

const dataDirectory = process.env.INQUIRY_DATA_DIR || "/home/ubuntu/tours-data/inquiries";
const databasePath = process.env.INQUIRY_DB_PATH || path.join(dataDirectory, "inquiries.db");

let database: Database.Database | undefined;

export function getDatabase() {
  if (database) return database;
  mkdirSync(path.dirname(databasePath), { recursive: true, mode: 0o700 });
  database = new Database(databasePath);
  chmodSync(databasePath, 0o600);
  database.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      received_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('contact', 'planner')),
      status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new', 'contacted', 'confirmed', 'archived')),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      month TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL DEFAULT '',
      timing TEXT NOT NULL DEFAULT '',
      duration TEXT NOT NULL DEFAULT '',
      traveller_group TEXT NOT NULL DEFAULT '',
      interests TEXT NOT NULL DEFAULT '[]',
      pace TEXT NOT NULL DEFAULT '',
      stay TEXT NOT NULL DEFAULT '',
      budget TEXT NOT NULL DEFAULT '',
      country TEXT NOT NULL DEFAULT '',
      ip TEXT NOT NULL DEFAULT '',
      admin_note TEXT NOT NULL DEFAULT ''
    );
    CREATE INDEX IF NOT EXISTS inquiries_received_at ON inquiries(received_at DESC);
    CREATE INDEX IF NOT EXISTS inquiries_status ON inquiries(status);
    CREATE TABLE IF NOT EXISTS prices (
      key TEXT PRIMARY KEY,
      min REAL NOT NULL,
      max REAL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS trip_settings (
      slug TEXT PRIMARY KEY,
      pinned INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 100,
      from_price REAL,
      hidden INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS admin_credentials (
      username TEXT PRIMARY KEY,
      password_hash TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  // Match the public retention notice: discard security identifiers quickly
  // and remove old, inactive inquiry records automatically.
  database.prepare("UPDATE inquiries SET ip = '' WHERE ip <> '' AND received_at < ?")
    .run(new Date(Date.now() - 90 * 24 * 60 * 60 * 1_000).toISOString());
  database.prepare("DELETE FROM inquiries WHERE received_at < ? AND status IN ('new', 'contacted', 'archived')")
    .run(new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1_000).toISOString());
  // Lightweight migrations for columns added after launch.
  const columns = new Set((database.prepare("PRAGMA table_info(inquiries)").all() as { name: string }[]).map((c) => c.name));
  if (!columns.has("language")) database.exec("ALTER TABLE inquiries ADD COLUMN language TEXT NOT NULL DEFAULT ''");
  if (!columns.has("page")) database.exec("ALTER TABLE inquiries ADD COLUMN page TEXT NOT NULL DEFAULT ''");
  return database;
}

type InquiryRow = {
  id: string;
  received_at: string;
  updated_at: string;
  type: "contact" | "planner";
  status: InquiryStatus;
  name: string;
  email: string;
  phone: string;
  month: string;
  message: string;
  timing: string;
  duration: string;
  traveller_group: string;
  interests: string;
  pace: string;
  stay: string;
  budget: string;
  country: string;
  ip: string;
  admin_note: string;
  language?: string;
  page?: string;
};

function hydrate(row: InquiryRow): InquiryRecord {
  let interests: string[] = [];
  try { interests = JSON.parse(row.interests) as string[]; } catch { interests = []; }
  return {
    id: row.id,
    receivedAt: row.received_at,
    updatedAt: row.updated_at,
    type: row.type,
    status: row.status,
    name: row.name,
    email: row.email,
    phone: row.phone,
    month: row.month,
    message: row.message,
    timing: row.timing,
    duration: row.duration,
    group: row.traveller_group,
    interests,
    pace: row.pace,
    stay: row.stay,
    budget: row.budget,
    country: row.country,
    ip: row.ip,
    adminNote: row.admin_note,
    language: row.language || "",
    page: row.page || "",
  };
}

export function saveInquiry(inquiry: NewInquiry) {
  const db = getDatabase();
  db.prepare(`
    INSERT INTO inquiries (
      id, received_at, updated_at, type, status, name, email, phone, month,
      message, timing, duration, traveller_group, interests, pace, stay,
      budget, country, ip, admin_note, language, page
    ) VALUES (?, ?, ?, ?, 'new', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', ?, ?)
  `).run(
    inquiry.id, inquiry.receivedAt, inquiry.receivedAt, inquiry.type,
    inquiry.name, inquiry.email, inquiry.phone, inquiry.month, inquiry.message,
    inquiry.timing, inquiry.duration, inquiry.group, JSON.stringify(inquiry.interests),
    inquiry.pace, inquiry.stay, inquiry.budget, inquiry.country, inquiry.ip, inquiry.language, inquiry.page,
  );
}

export function listInquiries(status?: InquiryStatus, search = "") {
  const db = getDatabase();
  const where: string[] = [];
  const params: string[] = [];
  if (status) { where.push("status = ?"); params.push(status); }
  const term = search.trim().slice(0, 80);
  if (term) {
    where.push("(name LIKE ? OR email LIKE ? OR phone LIKE ? OR message LIKE ? OR country LIKE ? OR admin_note LIKE ?)");
    const like = `%${term.replace(/[%_]/g, "")}%`;
    params.push(like, like, like, like, like, like);
  }
  const rows = db.prepare(`SELECT * FROM inquiries ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY received_at DESC LIMIT 300`).all(...params);
  return (rows as unknown as InquiryRow[]).map(hydrate);
}

export function inquiryCounts() {
  const rows = getDatabase().prepare("SELECT status, COUNT(*) AS count FROM inquiries GROUP BY status").all() as unknown as { status: InquiryStatus; count: number }[];
  const counts: Record<InquiryStatus | "all", number> = { all: 0, new: 0, contacted: 0, confirmed: 0, archived: 0 };
  for (const row of rows) {
    counts[row.status] = Number(row.count);
    counts.all += Number(row.count);
  }
  return counts;
}

export function updateInquiry(id: string, status: InquiryStatus, adminNote: string) {
  return getDatabase().prepare("UPDATE inquiries SET status = ?, admin_note = ?, updated_at = ? WHERE id = ?")
    .run(status, adminNote.slice(0, 4_000), new Date().toISOString(), id);
}

export function getAdminPasswordHash(username: string) {
  const row = getDatabase().prepare("SELECT password_hash FROM admin_credentials WHERE username = ?").get(username) as { password_hash: string } | undefined;
  return row?.password_hash;
}

export function setAdminPasswordHash(username: string, passwordHash: string) {
  getDatabase().prepare(`
    INSERT INTO admin_credentials (username, password_hash, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(username) DO UPDATE SET password_hash = excluded.password_hash, updated_at = excluded.updated_at
  `).run(username, passwordHash, new Date().toISOString());
}
