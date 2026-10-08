import { CalendarCheck, Check } from 'lucide-react';
import { useLang } from '../i18n';
import { IMAGES, whatsappLink } from '../data/content';
import { Img, Logo, Reveal } from './shared';

export default function About() {
  const { t } = useLang();
  const a = t.about;
  return (
    <section id="about" className="section about">
      <div className="container about-grid">
        <Reveal x={-40} y={0} className="about-visual">
          <div className="about-photo">
            <Img src={IMAGES.doctor} alt={a.name} />
          </div>          <div className="about-card">
            <Logo size={34} />
            <div>
              <strong>{a.reg}</strong>
              <small>Bangladesh Medical & Dental Council</small>
            </div>
          </div>
          <div className="about-deco" />
        </Reveal>

        <div className="about-copy">
          <Reveal>
            <span className="eyebrow">{a.eyebrow}</span>
            <h2>{a.name}</h2>
            <p className="degrees">{a.degrees}</p>
            <p className="lead">{a.bio}</p>
          </Reveal>
          <ul className="check-list">
            {a.points.map((p, i) => (
              <Reveal key={i} delay={0.1 * i} y={16}>
                <li>
                  <span className="check">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  {p}
                </li>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={0.3}>
            <a href={whatsappLink(t.contact.waMessage)} target="_blank" rel="noreferrer" className="btn btn-primary">
              <CalendarCheck size={18} /> {a.cta}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
