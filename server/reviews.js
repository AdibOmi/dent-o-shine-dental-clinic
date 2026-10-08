// Shared helpers for the review API (Cloudflare Pages Functions + D1).
// The D1 database is bound to the Pages project as `DB`; the table is created on first use.

export const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers },
  });

let tableReady = false;

/** The D1 database, with the reviews table guaranteed to exist. */
export async function db(env) {
  if (!env.DB) throw new Error('D1 binding "DB" is missing');
  if (!tableReady) {
    await env.DB.prepare(
      `CREATE TABLE IF NOT EXISTS reviews (
        id          TEXT PRIMARY KEY,
        name        TEXT NOT NULL,
        phone       TEXT NOT NULL UNIQUE,
        rating      INTEGER NOT NULL,
        text        TEXT NOT NULL DEFAULT '',
        status      TEXT NOT NULL DEFAULT 'pending',
        created_at  TEXT NOT NULL,
        approved_at TEXT
      )`
    ).run();
    tableReady = true;
  }
  return env.DB;
}

const BN_DIGITS = '০১২৩৪৫৬৭৮৯';

/** Bangladeshi mobile number → "01XXXXXXXXX", or null if invalid. Accepts Bangla digits and +880. */
export function normalizePhone(raw) {
  let d = String(raw || '')
    .replace(/[০-৯]/g, (c) => String(BN_DIGITS.indexOf(c)))
    .replace(/\D/g, '');
  if (d.startsWith('880')) d = d.slice(2);
  else if (d.startsWith('1') && d.length === 10) d = '0' + d;
  return /^01[3-9]\d{8}$/.test(d) ? d : null;
}

export const cleanText = (s, max) =>
  String(s || '')
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, max);

const sha256 = async (s) => crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(s)));

/** Checks the "Authorization: Bearer <password>" header against the ADMIN_PASSWORD secret. */
export async function isAdmin(request, env) {
  const given = (request.headers.get('authorization') || '').replace(/^Bearer /, '');
  const [a, b] = await Promise.all([sha256(given), sha256(env.ADMIN_PASSWORD)]);
  return crypto.subtle.timingSafeEqual(a, b);
}
