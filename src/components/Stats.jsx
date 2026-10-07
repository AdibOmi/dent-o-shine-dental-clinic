import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';
import { useLang } from '../i18n';
import { Reveal } from './shared';

function Counter({ to, suffix }) {
  const { num } = useLang();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration: 2, ease: 'easeOut', onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref}>
      {num(value.toLocaleString('en-US'))}
      <em>{suffix}</em>
    </span>
  );
}

export default function Stats() {
  const { t } = useLang();
  return (
    <section className="stats">
      <div className="container stats-grid">
        {t.stats.map((s, i) => (
          <Reveal key={i} delay={i * 0.1} className="stat">
            <Counter to={s.value} suffix={s.suffix} />
            <p>{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
