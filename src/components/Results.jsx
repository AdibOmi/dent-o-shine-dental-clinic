import { useState } from 'react';
import { motion } from 'framer-motion';
import { MoveHorizontal } from 'lucide-react';
import { useLang } from '../i18n';
import { IMAGES } from '../data/content';
import { Img, Reveal, SectionHead } from './shared';

/**
 * Draggable before/after comparison. Pass a separate `before` image once
 * real patient photos are available; until then a stain filter is applied
 * to the `after` image to simulate the "before" state.
 */
function BeforeAfter({ before, after, labels }) {
  const [pos, setPos] = useState(50);
  const simulated = !before;
  return (
    <div className="ba">
      <Img src={after} alt={labels.after} className="ba-img" />
      <div className="ba-before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Img src={before || after} alt={labels.before} className={`ba-img ${simulated ? 'ba-stained' : ''}`} />
      </div>
      <span className="ba-label left">{labels.before}</span>
      <span className="ba-label right">{labels.after}</span>
      <div className="ba-handle" style={{ left: `${pos}%` }}>
        <span>
          <MoveHorizontal size={20} />
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Compare before and after"
      />
    </div>
  );
}

export default function Results() {
  const { t } = useLang();
  const r = t.results;
  return (
    <section id="results" className="section results">
      <div className="container">
        <SectionHead eyebrow={r.eyebrow} title={r.title} subtitle={r.subtitle} />
        <Reveal className="ba-wrap">
          <BeforeAfter after={IMAGES.beforeAfter} labels={{ before: r.before, after: r.after }} />
        </Reveal>

        <Reveal>
          <h3 className="gallery-title">{r.galleryTitle}</h3>
        </Reveal>
        <div className="gallery">
          {IMAGES.gallery.map((src, i) => (
            <motion.div
              key={i}
              className={`gallery-item g-${i}`}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.07 }}
            >
              <Img src={src} alt={`Dent-O-Shine gallery ${i + 1}`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
