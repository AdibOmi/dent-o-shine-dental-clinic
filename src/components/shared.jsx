import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CONTACT } from '../data/content';

const ease = [0.22, 1, 0.36, 1];

export function Reveal({ children, delay = 0, y = 32, x = 0, className, style }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({ eyebrow, title, subtitle, center = true }) {
  return (
    <Reveal className={`section-head ${center ? 'center' : ''}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </Reveal>
  );
}

/** Image that falls back to a soft green gradient if the URL fails. */
export function Img({ src, alt, className, style }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className={`img-fallback ${className || ''}`} style={style} role="img" aria-label={alt} />;
  return <img src={src} alt={alt} className={className} style={style} loading="lazy" onError={() => setFailed(true)} />;
}

export function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2fc495" />
          <stop offset="1" stopColor="#0e9f9a" />
        </linearGradient>
      </defs>
      <path
        fill="url(#logo-g)"
        d="M32 12c-5-4-12-6-18-3-7 4-8 13-5 21 2 6 3 12 4 19 1 5 3 9 6 9 4 0 4-6 6-12 1-4 4-6 7-6s6 2 7 6c2 6 2 12 6 12 3 0 5-4 6-9 1-7 2-13 4-19 3-8 2-17-5-21-6-3-13-1-18 3z"
      />
      <path fill="none" stroke="#f26b3a" strokeWidth="5" strokeLinecap="round" d="M10 34c10-4 24-14 44-22" />
    </svg>
  );
}

function dhakaNow() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Dhaka',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type)?.value;
  return { day: get('weekday'), minutes: Number(get('hour') || 0) * 60 + Number(get('minute') || 0) };
}

const checkStatus = () => {
  const { day, minutes } = dhakaNow();
  const friday = day === CONTACT.closedDay;
  const open = !friday && minutes >= CONTACT.openMinutes && minutes < CONTACT.closeMinutes;
  // Closed all Friday, so after Thursday's closing the next opening is Saturday
  const opensSaturday = friday || (day === 'Thu' && minutes >= CONTACT.closeMinutes);
  return { open, opensSaturday };
};

/** Live open/closed status based on Dhaka time. Re-checks every minute. */
export function useOpenStatus() {
  const [status, setStatus] = useState(checkStatus);
  useEffect(() => {
    const id = setInterval(() => setStatus(checkStatus()), 60_000);
    return () => clearInterval(id);
  }, []);
  return status;
}

/** "Closes at …" / "Opens at …" / "Opens Saturday at …" for the status chip. */
export const statusNote = (t, { open, opensSaturday }) =>
  open ? t.status.closesAt : opensSaturday ? t.status.opensSat : t.status.opensAt;
