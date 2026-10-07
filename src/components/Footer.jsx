import { Mail, MapPin, Phone } from 'lucide-react';
import { useLang } from '../i18n';
import { CONTACT } from '../data/content';
import { Logo } from './shared';

export default function Footer() {
  const { t, num } = useLang();
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand light">
            <Logo size={44} />
            <span className="brand-text">
              <strong>DENT-O-SHINE</strong>
              <small>{t.hero.tagline}</small>
            </span>
          </div>
          <p className="footer-about">{t.footer.about}</p>
          <p className="footer-doc">
            {t.about.name} · {t.about.degrees}
          </p>
        </div>
        <div>
          <h4>{t.footer.quick}</h4>
          <ul>
            {['about', 'services', 'results', 'reviews', 'contact'].map((id) => (
              <li key={id}>
                <a href={`#${id}`}>{t.nav[id]}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>{t.footer.reach}</h4>
          <ul className="footer-contact">
            <li>
              <MapPin size={16} /> {t.contact.address}
            </li>
            <li>
              <Phone size={16} /> <a href={`tel:${CONTACT.phoneTel}`}>{num(CONTACT.phoneDisplay)}</a>
            </li>
            <li>
              <Mail size={16} /> <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        © {num(year)} Dent-O-Shine. {t.footer.rights}
      </div>
    </footer>
  );
}
