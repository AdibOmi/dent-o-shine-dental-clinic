import { useCallback, useEffect, useState } from 'react';
import { Check, EyeOff, LogOut, Phone, RefreshCw, Trash2 } from 'lucide-react';
import { Logo } from '../components/shared';
import { Stars } from '../components/Testimonials';

const KEY = 'dos-admin-pass';

const readPass = () => {
  try {
    return sessionStorage.getItem(KEY) || '';
  } catch {
    return '';
  }
};
const savePass = (p) => {
  try {
    p ? sessionStorage.setItem(KEY, p) : sessionStorage.removeItem(KEY);
  } catch {
    /* storage unavailable */
  }
};

const fmtDate = (iso) =>
  new Date(iso).toLocaleString('en-GB', { timeZone: 'Asia/Dhaka', dateStyle: 'medium', timeStyle: 'short' });

async function api(pass, options = {}) {
  const res = await fetch('/api/admin/reviews', {
    ...options,
    headers: { Authorization: `Bearer ${pass}`, 'Content-Type': 'application/json' },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'server');
  return data;
}

const ERRORS = {
  unauthorized: 'Wrong password.',
  'not-configured': 'ADMIN_PASSWORD is not set in the Cloudflare Pages project yet.',
  server: 'Could not reach the server. Check your internet and try again.',
};

export default function AdminApp() {
  const [pass, setPass] = useState(readPass);
  const [reviews, setReviews] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');

  const load = useCallback(async (p) => {
    setError('');
    setBusy('load');
    try {
      setReviews(await api(p));
      savePass(p);
      setPass(p);
    } catch (e) {
      setError(ERRORS[e.message] || ERRORS.server);
      if (e.message === 'unauthorized') {
        savePass('');
        setPass('');
      }
    }
    setBusy('');
  }, []);

  useEffect(() => {
    if (pass) load(pass);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const act = async (action, review) => {
    if (action === 'delete' && !window.confirm(`Delete the review from ${review.name}? This cannot be undone.`)) return;
    setBusy(review.id);
    try {
      await api(pass, { method: 'POST', body: JSON.stringify({ action, id: review.id }) });
      setReviews(await api(pass));
    } catch (e) {
      setError(ERRORS[e.message] || ERRORS.server);
    }
    setBusy('');
  };

  const logout = () => {
    savePass('');
    setPass('');
    setReviews(null);
  };

  if (!reviews) return <Login onSubmit={load} error={error} busy={busy === 'load'} />;

  const pending = reviews.filter((r) => r.status !== 'approved');
  const approved = reviews.filter((r) => r.status === 'approved');

  return (
    <div className="admin">
      <header className="admin-head">
        <div className="admin-brand">
          <Logo size={32} />
          <strong>Patient reviews</strong>
        </div>
        <div className="admin-tools">
          <button className="btn btn-light btn-sm" onClick={() => load(pass)} disabled={busy === 'load'}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="btn btn-light btn-sm" onClick={logout}>
            <LogOut size={16} /> Log out
          </button>
        </div>
      </header>

      {error && <p className="form-error">{error}</p>}

      <Group title="Waiting for approval" empty="No new reviews." items={pending} busy={busy}>
        {(r) => (
          <>
            <button className="btn btn-primary btn-sm" onClick={() => act('approve', r)}>
              <Check size={16} /> Approve
            </button>
            <button className="btn btn-light btn-sm danger" onClick={() => act('delete', r)}>
              <Trash2 size={16} /> Delete
            </button>
          </>
        )}
      </Group>

      <Group title="Shown on the website" empty="No approved reviews yet." items={approved} busy={busy}>
        {(r) => (
          <>
            <button className="btn btn-light btn-sm" onClick={() => act('unpublish', r)}>
              <EyeOff size={16} /> Hide
            </button>
            <button className="btn btn-light btn-sm danger" onClick={() => act('delete', r)}>
              <Trash2 size={16} /> Delete
            </button>
          </>
        )}
      </Group>
    </div>
  );
}

function Group({ title, empty, items, busy, children }) {
  return (
    <section className="admin-group">
      <h2>
        {title} <span className="admin-badge">{items.length}</span>
      </h2>
      {items.length === 0 && <p className="admin-empty">{empty}</p>}
      {items.map((r) => (
        <article key={r.id} className={`admin-card ${busy === r.id ? 'busy' : ''}`}>
          <div className="admin-meta">
            <strong>{r.name}</strong>
            <a href={`tel:${r.phone}`}>
              <Phone size={14} /> {r.phone}
            </a>
            <small>{fmtDate(r.createdAt)}</small>
          </div>
          {r.rating && <Stars rating={r.rating} size={16} />}
          {r.text ? <p>{r.text}</p> : <p className="admin-empty">(Stars only, no written review)</p>}
          <div className="admin-actions">{children(r)}</div>
        </article>
      ))}
    </section>
  );
}

function Login({ onSubmit, error, busy }) {
  const [value, setValue] = useState('');
  return (
    <div className="admin-login">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (value) onSubmit(value);
        }}
      >
        <Logo size={44} />
        <h1>Dent-O-Shine reviews</h1>
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Admin password"
          autoComplete="current-password"
          autoFocus
        />
        {error && <p className="form-error">{error}</p>}
        <button className="btn btn-primary" disabled={busy}>
          {busy ? 'Checking…' : 'Log in'}
        </button>
      </form>
    </div>
  );
}
