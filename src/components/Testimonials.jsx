import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { useLang } from '../i18n';
import { Reveal, SectionHead } from './shared';

export default function Testimonials() {
  const { t } = useLang();
  const items = t.reviews.items;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 6000);
    return () => clearInterval(id);
  }, [paused, items.length]);

  const go = (d) => setIndex((i) => (i + d + items.length) % items.length);
  const item = items[index];

  return (
    <section id="reviews" className="section reviews">
      <div className="container">
        <SectionHead eyebrow={t.reviews.eyebrow} title={t.reviews.title} />
        <Reveal className="review-stage">
          <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            <Quote className="review-quote" size={64} />
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                className="review-card"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.45 }}
              >
                <div className="stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
                <p>“{item.text}”</p>
                <div className="reviewer">
                  <span className="avatar">{item.name.charAt(0)}</span>
                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.role}</small>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="review-nav">
              <button onClick={() => go(-1)} aria-label="Previous review">
                <ChevronLeft />
              </button>
              <div className="dots">
                {items.map((_, i) => (
                  <button key={i} className={i === index ? 'on' : ''} onClick={() => setIndex(i)} aria-label={`Review ${i + 1}`} />
                ))}
              </div>
              <button onClick={() => go(1)} aria-label="Next review">
                <ChevronRight />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
