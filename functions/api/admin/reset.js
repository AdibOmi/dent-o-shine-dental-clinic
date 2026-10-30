// Forgotten admin password  →  /api/admin/reset
// Requires the ADMIN_RECOVERY_KEY secret (Pages project → Settings → Variables and Secrets).
// Use a long random key and give it to the clinic to keep somewhere safe, e.g. on paper.
//   POST { recoveryKey, password }  → saves the new password; the old one stops working
import { json, safeEqual, setAdminPassword } from '../../../server/reviews.js';

export async function onRequestPost({ request, env }) {
  try {
    if (!env.ADMIN_RECOVERY_KEY) return json({ error: 'recovery-not-configured' }, 503);
    const { recoveryKey, password } = await request.json().catch(() => ({}));
    if (!(await safeEqual(String(recoveryKey || '').trim(), env.ADMIN_RECOVERY_KEY))) {
      // Slow down key guessing
      await new Promise((r) => setTimeout(r, 800));
      return json({ error: 'wrong-recovery-key' }, 401);
    }
    if (typeof password !== 'string' || password.length < 8) return json({ error: 'weak-password' }, 400);
    await setAdminPassword(env, password);
    return json({ ok: true });
  } catch (err) {
    console.error('/api/admin/reset failed', err);
    return json({ error: 'server' }, 500);
  }
}
