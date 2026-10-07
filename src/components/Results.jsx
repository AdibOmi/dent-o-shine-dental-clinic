import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand, MoveHorizontal, X } from 'lucide-react';
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
        <Gallery images={IMAGES.gallery} />
      </div>
    </section>
  );
}

/** Masonry gallery (handles any count / mixed orientations) with a lightbox. */
function Gallery({ images }) {
  const [open, setOpen] = useState(null);
  const count = images.length;
  const go = (d) => setOpen((i) => (i + d + count) % count);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <div className="gallery">
        {images.map((src, i) => (
          <motion.button
            key={src}
            className="gallery-item"
            onClick={() => setOpen(i)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
            aria-label={`Open photo ${i + 1}`}
          >
            <Img src={src} alt={`Dent-O-Shine clinic photo ${i + 1}`} />
            <span className="gallery-zoom">
              <Expand size={20} />
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="lightbox"
            onClick={() => setOpen(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={open}
                src={images[open]}
                alt={`Dent-O-Shine clinic photo ${open + 1}`}
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
              />
            </AnimatePresence>
            <button className="lb-btn lb-close" onClick={() => setOpen(null)} aria-label="Close">
              <X />
            </button>
            {count > 1 && (
              <>
                <button className="lb-btn lb-prev" onClick={(e) => (e.stopPropagation(), go(-1))} aria-label="Previous photo">
                  <ChevronLeft />
                </button>
                <button className="lb-btn lb-next" onClick={(e) => (e.stopPropagation(), go(1))} aria-label="Next photo">
                  <ChevronRight />
                </button>
              </>
            )}
            <span className="lb-count">
              {open + 1} / {count}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
