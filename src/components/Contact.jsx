import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react';
import { useLang } from '../i18n';
import { CONTACT, whatsappLink } from '../data/content';
import { Reveal, SectionHead, useOpenStatus } from './shared';

export default function Contact() {
  const { t, num } = useLang();
  const c = t.contact;
  const open = useOpenStatus();
  const q = encodeURIComponent(CONTACT.mapQuery);

  const rows = [
    { icon: MapPin, label: c.addressLabel, value: c.address },
    { icon: Phone, label: c.phoneLabel, value: num(CONTACT.phoneDisplay), href: `tel:${CONTACT.phoneTel}` },
    { icon: Mail, label: c.emailLabel, value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { icon: Clock, label: c.hoursLabel, value: c.hours },
  ];

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <SectionHead eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} />
        <div className="contact-grid">
          <Reveal x={-30} y={0} className="contact-card">
            <div className={`status-chip ${open ? 'open' : 'closed'}`}>
              <span className="pulse" />
              {open ? t.status.open : t.status.closed}
              <span className="muted">· {open ? t.status.closesAt : t.status.opensAt}</span>
            </div>
            <ul className="contact-rows">
              {rows.map(({ icon: Icon, label, value, href }) => (
                <li key={label}>
                  <span className="contact-icon">
                    <Icon size={20} />
                  </span>
                  <div>
                    <small>{label}</small>
                    {href ? <a href={href}>{value}</a> : <p>{value}</p>}
                  </div>
                </li>
              ))}
            </ul>
            <div className="contact-ctas">
              <a href={`tel:${CONTACT.phoneTel}`} className="btn btn-primary btn-lg">
                <Phone size={20} /> {t.callNow}
              </a>
              <a href={whatsappLink(c.waMessage)} target="_blank" rel="noreferrer" className="btn btn-wa btn-lg">
                <MessageCircle size={20} /> {t.whatsapp}
              </a>
            </div>
          </Reveal>

          <Reveal x={30} y={0} className="map-card">
            <iframe
              title="Dent-O-Shine location"
              src={`https://www.google.com/maps?q=${q}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              className="btn btn-light map-btn"
              href={`https://www.google.com/maps/dir/?api=1&destination=${q}`}
              target="_blank"
              rel="noreferrer"
            >
              <Navigation size={16} /> {c.directions}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
