import { motion, useScroll, useTransform } from 'framer-motion';
import { Clock, MessageCircle, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { useLang } from '../i18n';
import { CONTACT, IMAGES, whatsappLink } from '../data/content';
import { Img, useOpenStatus } from './shared';

const ease = [0.22, 1, 0.36, 1];
const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease },
});

export default function Hero() {
  const { t } = useLang();
  const open = useOpenStatus();
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 600], [0, 80]);
  const blobY = useTransform(scrollY, [0, 600], [0, -60]);

  return (
    <section id="home" className="hero">
      <motion.div className="blob blob-1" style={{ y: blobY }} />
      <div className="blob blob-2" />
      <div className="hero-dots" />

      <div className="container hero-grid">
        <div className="hero-copy">
          <motion.div {...fadeUp(0.1)} className={`status-chip ${open ? 'open' : 'closed'}`}>
            <span className="pulse" />
            {open ? t.status.open : t.status.closed}
            <span className="muted">· {open ? t.status.closesAt : t.status.opensAt}</span>
          </motion.div>

          <motion.p {...fadeUp(0.2)} className="tagline">
            {t.hero.tagline}
          </motion.p>

          <motion.h1 {...fadeUp(0.3)}>
            {t.hero.titleA}
            <br />
            <span className="grad-text">{t.hero.titleB}</span>
          </motion.h1>

          <motion.p {...fadeUp(0.45)} className="hero-sub">
            {t.hero.subtitle}
          </motion.p>

          <motion.div {...fadeUp(0.6)} className="hero-ctas">
            <a href={`tel:${CONTACT.phoneTel}`} className="btn btn-primary btn-lg">
              <Phone size={20} /> {t.callNow}
            </a>
            <a href={whatsappLink(t.contact.waMessage)} target="_blank" rel="noreferrer" className="btn btn-wa btn-lg">
              <MessageCircle size={20} /> {t.whatsapp}
            </a>
          </motion.div>

          <motion.div {...fadeUp(0.75)} className="hero-meta">
            <span>
              <Clock size={16} /> {t.hero.hours}
            </span>
            <span>
              <Phone size={16} /> {CONTACT.phoneDisplay}
            </span>
          </motion.div>
        </div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.2, ease }}
        >
          <div className="hero-ring" />
          <motion.div className="hero-photo" style={{ y: imgY }}>
            <Img src={IMAGES.hero} alt="Dent-O-Shine dental chamber" />
          </motion.div>

          <motion.a
            href="#about"
            className="float-card fc-1"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="fc-avatar">
              <Img src={IMAGES.doctorAvatar} alt={t.about.name} />
            </span>
            <div>
              <strong>{t.about.name}</strong>
              <small>{t.hero.badgeSpecialist}</small>
            </div>
          </motion.a>

          <motion.div className="float-card fc-2" animate={{ y: [0, 12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
            <span className="fc-icon orange">
              <Sparkles size={20} />
            </span>
            <div>
              <strong>{t.hero.badgeCare}</strong>
            </div>
          </motion.div>

          <motion.div className="float-card fc-3" animate={{ y: [0, -10, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
            <span className="fc-icon">
              <ShieldCheck size={20} />
            </span>
            <div>
              <strong>{t.hero.badgeReg}</strong>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <svg className="hero-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,64 C240,120 480,0 720,48 C960,96 1200,24 1440,64 L1440,120 L0,120 Z" />
      </svg>
    </section>
  );
}
