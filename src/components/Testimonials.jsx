import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, ChevronLeft, ChevronRight, PenLine, Quote, Star } from 'lucide-react';
import { useLang } from '../i18n';
import { Reveal, SectionHead } from './shared';

// Above this many reviews the dots get too wide for phones, so show "3 / 12" instead
const MAX_DOTS = 8;

/** Approved patient reviews from the server. Fails quietly (e.g. under plain `vite dev`). */
function usePatientReviews() {
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    const ctrl = new AbortController();
    fetch('/api/reviews', { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => Array.isArray(data) && setReviews(data.filter((r) => r && r.name && r.rating)))
      .catch(() => {});
    return () => ctrl.abort();
  }, []);
  return reviews;
}

export default function Testimonials() {
  const { t, num } = useLang();
  const r = t.reviews;
  const patientReviews = usePatientReviews();
  const items = [...patientReviews.map((p) => ({ ...p, role: r.patient })), ...r.items];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    if (paused || formOpen || items.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 6000);
    return () => clearInterval(id);
  }, [paused, formOpen, items.length]);

  const go = (d) => setIndex((i) => (i + d + items.length) % items.length);
  const item = items[index % items.length];

  return (
    <section id="reviews" className="section reviews">
      <div className="container">
        <SectionHead eyebrow={r.eyebrow} title={r.title} />
        <Reveal className="review-stage">
          {item && (
            <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
              <Quote className="review-quote" size={64} />
              <AnimatePresence mode="wait">
                <motion.div
                  key={item.id || `${item.name}-${index}`}
                  className="review-card"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.45 }}
                >
                  <Stars rating={item.rating || 5} />
                  {item.text && <p>“{item.text}”</p>}
                  <div className="reviewer">
                    <span className="avatar">{item.name.charAt(0).toUpperCase()}</span>
                    <div>
                      <strong>{item.name}</strong>
                      <small>{item.role}</small>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              {items.length > 1 && (
                <div className="review-nav">
                  <button onClick={() => go(-1)} aria-label="Previous review">
                    <ChevronLeft />
                  </button>
                  {items.length <= MAX_DOTS ? (
                    <div className="dots">
                      {items.map((_, i) => (
                        <button key={i} className={i === index ? 'on' : ''} onClick={() => setIndex(i)} aria-label={`Review ${i + 1}`} />
                      ))}
                    </div>
                  ) : (
                    <span className="review-count">
                      {num(index + 1)} / {num(items.length)}
                    </span>
                  )}
                  <button onClick={() => go(1)} aria-label="Next review">
                    <ChevronRight />
                  </button>
                </div>
              )}
            </div>
          )}

          <ReviewForm open={formOpen} setOpen={setFormOpen} f={r.form} />
        </Reveal>
      </div>
    </section>
  );
}

export function Stars({ rating, size = 18 }) {
  return (
    <div className="stars" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} fill={i < rating ? 'currentColor' : 'none'} className={i < rating ? '' : 'star-empty'} />
      ))}
    </div>
  );
}

function StarPicker({ value, onChange, label }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="star-picker" role="radiogroup" aria-label={label} onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          className={n <= shown ? 'on' : ''}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
        >
          <Star size={30} fill={n <= shown ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );
}

function ReviewForm({ open, setOpen, f }) {
  const [values, setValues] = useState({ name: '', phone: '', rating: 0, text: '', company: '' });
  const [state, setState] = useState('idle'); // idle | sending | done
  const [error, setError] = useState('');

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const name = values.name.trim();
    const digits = values.phone.replace(/[০-৯]/g, (c) => '০১২৩৪৫৬৭৮৯'.indexOf(c)).replace(/\D/g, '');
    if (name.length < 2) return setError(f.errors.name);
    if (!/^(?:880|0)?1[3-9]\d{8}$/.test(digits)) return setError(f.errors.phone);
    if (!values.rating) return setError(f.errors.rating);

    setError('');
    setState('sending');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, name }),
      });
      if (res.ok) {
        setState('done');
        return;
      }
      const { error: code } = await res.json().catch(() => ({}));
      setError(f.errors[code] || f.errors.server);
    } catch {
      setError(f.errors.server);
    }
    setState('idle');
  };

  if (state === 'done') {
    return (
      <motion.p className="review-thanks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <CheckCircle2 size={20} /> {f.thanks}
      </motion.p>
    );
  }

  if (!open) {
    return (
      <button className="btn btn-wa review-open" onClick={() => setOpen(true)}>
        <PenLine size={18} /> {f.open}
      </button>
    );
  }

  return (
    <motion.form
      className="review-form"
      onSubmit={submit}
      noValidate
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <h3>{f.title}</h3>
      <label>
        <span>{f.name}</span>
        <input value={values.name} onChange={set('name')} maxLength={60} autoComplete="name" required />
      </label>
      <label>
        <span>{f.phone}</span>
        <input
          value={values.phone}
          onChange={set('phone')}
          type="tel"
          inputMode="tel"
          maxLength={20}
          autoComplete="tel"
          placeholder="01XXXXXXXXX"
          required
        />
        <small>{f.phoneHint}</small>
      </label>
      <div className="field">
        <span>{f.rating}</span>
        <StarPicker value={values.rating} onChange={(rating) => setValues((v) => ({ ...v, rating }))} label={f.rating} />
      </div>
      <label>
        <span>{f.text}</span>
        <textarea value={values.text} onChange={set('text')} rows={4} maxLength={800} placeholder={f.textPlaceholder} />
      </label>
      {/* Honeypot for spam bots — hidden from people */}
      <input className="hp" value={values.company} onChange={set('company')} tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="review-form-actions">
        <button type="button" className="btn btn-light" onClick={() => setOpen(false)}>
          {f.cancel}
        </button>
        <button type="submit" className="btn btn-primary" disabled={state === 'sending'}>
          {state === 'sending' ? f.sending : f.submit}
        </button>
      </div>
    </motion.form>
  );
}
