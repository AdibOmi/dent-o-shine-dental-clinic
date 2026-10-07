import { motion } from 'framer-motion';
import { Activity, Baby, Crown, Scissors, ShieldCheck, Smile, Sparkles, Stethoscope } from 'lucide-react';
import { useLang } from '../i18n';
import { IMAGES, SERVICE_KEYS } from '../data/content';
import { Img, SectionHead } from './shared';

const ICONS = {
  braces: Smile,
  rootCanal: Activity,
  implants: ShieldCheck,
  whitening: Sparkles,
  scaling: Stethoscope,
  surgery: Scissors,
  crowns: Crown,
  pediatric: Baby,
};

export default function Services() {
  const { t } = useLang();
  const s = t.services;
  return (
    <section id="services" className="section services">
      <div className="container">
        <SectionHead eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} />
        <div className="services-grid">
          {SERVICE_KEYS.map((key, i) => {
            const Icon = ICONS[key];
            return (
              <motion.article
                key={key}
                className="service-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.08 }}
                whileHover={{ y: -8 }}
              >
                <div className="service-img">
                  <Img src={IMAGES.services[key]} alt={s.items[key].title} />
                </div>
                <div className="service-body">
                  <span className="service-icon">
                    <Icon size={22} />
                  </span>
                  <h3>{s.items[key].title}</h3>
                  <p>{s.items[key].desc}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
