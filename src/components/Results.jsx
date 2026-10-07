import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand, ShieldCheck, X } from 'lucide-react';
import { useLang } from '../i18n';
import { CASES, IMAGES } from '../data/content';
import { Img, Reveal, SectionHead } from './shared';

export default function Results() {
  const { t } = useLang();
  const r = t.results;
  // { images, captions, index } while the lightbox is open
  const [viewer, setViewer] = useState(null);

  return (
    <section id="results" className="section results">
      <div className="container">
        <SectionHead eyebrow={r.eyebrow} title={r.title} subtitle={r.subtitle} />

        {CASES.map((c) => (
          <CaseStudy
            key={c.key}
            steps={c.steps}
            labels={r.steps}
            title={r.cases[c.key].title}
            desc={r.cases[c.key].desc}
            onOpen={(index) => setViewer({ images: c.steps, captions: r.steps, index })}
          />
        ))}
        <Reveal>
          <p className="consent">
            <ShieldCheck size={15} /> {r.consent}
          </p>
        </Reveal>

        <div id="gallery" className="gallery-block">
          <Reveal className="gallery-head">
            <h3 className="gallery-title">{r.galleryTitle}</h3>
            <p>{r.gallerySub}</p>
          </Reveal>
          <Gallery images={IMAGES.gallery} onOpen={(index) => setViewer({ images: IMAGES.gallery, index })} />
        </div>
      </div>

      <Lightbox viewer={viewer} setViewer={setViewer} />
    </section>
  );
}

/** Before → During → After journey for one patient case. */
function CaseStudy({ steps, labels, title, desc, onOpen }) {
  return (
    <Reveal className="case">
      <div className="case-head">
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
      <div className="case-steps">
        {steps.map((src, i) => (
          <div key={src} className="case-step-wrap">
            <motion.button
              className={`case-step ${i === steps.length - 1 ? 'final' : ''}`}
              onClick={() => onOpen(i)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              aria-label={`${labels[i]} — ${title}`}
            >
              <Img src={src} alt={`${title}: ${labels[i]}`} />
              <span className="case-label">
                <b>{i + 1}</b> {labels[i]}
              </span>
            </motion.button>
            {i < steps.length - 1 && (
              <span className="case-arrow" aria-hidden="true">
                <ChevronRight size={18} />
              </span>
            )}
          </div>
        ))}
      </div>
    </Reveal>
  );
}

/**
 * Clinic gallery. Exactly 3 photos get a bento layout (first photo = tall,
 * so make it a portrait); any other count uses a masonry layout.
 */
function Gallery({ images, onOpen }) {
  const layout = images.length === 3 ? 'bento' : 'masonry';
  return (
    <div className={`gallery ${layout}`}>
      {images.map((src, i) => (
        <motion.button
          key={src}
          className="gallery-item"
          onClick={() => onOpen(i)}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
          aria-label={`Open photo ${i + 1}`}
        >
          <Img src={src} alt={`Dent-O-Shine clinic photo ${i + 1}`} />
          <span className="gallery-zoom">
            <Expand size={20} />
          </span>
        </motion.button>
      ))}
    </div>
  );
}

function Lightbox({ viewer, setViewer }) {
  const close = () => setViewer(null);
  const go = (d) =>
    setViewer((v) => ({ ...v, index: (v.index + d + v.images.length) % v.images.length }));

  useEffect(() => {
    if (!viewer) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [viewer !== null]);

  return (
    <AnimatePresence>
      {viewer && (
        <motion.div className="lightbox" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <AnimatePresence mode="wait">
            <motion.figure
              key={viewer.index}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
            >
              <img src={viewer.images[viewer.index]} alt="" />
              {viewer.captions && <figcaption>{viewer.captions[viewer.index]}</figcaption>}
            </motion.figure>
          </AnimatePresence>
          <button className="lb-btn lb-close" onClick={close} aria-label="Close">
            <X />
          </button>
          {viewer.images.length > 1 && (
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
            {viewer.index + 1} / {viewer.images.length}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
