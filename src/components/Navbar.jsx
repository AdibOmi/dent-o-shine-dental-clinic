import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Phone, X } from 'lucide-react';
import { useLang } from '../i18n';
import { CONTACT } from '../data/content';
import { Logo } from './shared';

const LINKS = ['home', 'about', 'services', 'results', 'reviews', 'contact'];

export default function Navbar() {
  const { t, lang, toggle } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the nav link for the section currently in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    LINKS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        <a href="#home" className="brand" onClick={() => setOpen(false)}>
          <Logo size={42} />
          <span className="brand-text">
            <strong>DENT-O-SHINE</strong>
            <small>{t.hero.tagline}</small>
          </span>
        </a>

        <nav className="nav-links">
          {LINKS.map((id) => (
            <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>
              {t.nav[id]}
              {active === id && <motion.span layoutId="nav-pill" className="nav-pill" />}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <button className="lang-toggle" onClick={toggle} aria-label="Switch language">
            <span className={lang === 'en' ? 'on' : ''}>EN</span>
            <span className={lang === 'bn' ? 'on' : ''}>বাং</span>
          </button>
          <a href={`tel:${CONTACT.phoneTel}`} className="btn btn-primary btn-sm nav-call">
            <Phone size={16} /> {t.callNow}
          </a>
          <button className="burger" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
          >
            {LINKS.map((id, i) => (
              <motion.a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i }}
              >
                {t.nav[id]}
              </motion.a>
            ))}
            <a href={`tel:${CONTACT.phoneTel}`} className="btn btn-primary">
              <Phone size={18} /> {t.callNow}
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
