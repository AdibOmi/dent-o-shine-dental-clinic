// Shared helpers for the review API (Cloudflare Pages Functions + D1).
// The D1 database is bound to the Pages project as `DB`; the tables are created on first use.

export const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers },
  });

let tableReady = false;

/** The D1 database, with the reviews and settings tables guaranteed to exist. */
export async function db(env) {
  if (!env.DB) throw new Error('D1 binding "DB" is missing');
  if (!tableReady) {
    await env.DB.batch([
      env.DB.prepare(
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
      ),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)`),
    ]);
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
const toHex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');

/** Constant-time string comparison. */
export async function safeEqual(a, b) {
  const [x, y] = await Promise.all([sha256(a), sha256(b)]);
  return crypto.subtle.timingSafeEqual(x, y);
}

// Salted SHA-256 rather than a slow KDF: the hash is checked on every admin request and
// Pages Functions on the free plan only get ~10ms of CPU. D1 is not publicly readable.
const hashPassword = async (password, salt = toHex(crypto.getRandomValues(new Uint8Array(16)))) =>
  `${salt}:${toHex(await sha256(salt + password))}`;

/** Saves a new admin password. From then on it replaces the ADMIN_PASSWORD secret. */
export async function setAdminPassword(env, password) {
  await (await db(env))
    .prepare(`INSERT OR REPLACE INTO settings (key, value) VALUES ('admin_password', ?)`)
    .bind(await hashPassword(password))
    .run();
}

/**
 * Whether `given` is the admin password. A password set through the reset flow
 * (stored hashed in D1) wins; otherwise the ADMIN_PASSWORD secret is used.
 */
export async function isAdminPassword(env, given) {
  const row = await (await db(env)).prepare(`SELECT value FROM settings WHERE key = 'admin_password'`).first();
  if (row) return safeEqual(await hashPassword(given, row.value.split(':')[0]), row.value);
  return Boolean(env.ADMIN_PASSWORD) && safeEqual(given, env.ADMIN_PASSWORD);
}

/** Checks the "Authorization: Bearer <password>" header. */
export const isAdmin = (request, env) =>
  isAdminPassword(env, (request.headers.get('authorization') || '').replace(/^Bearer /, ''));
