import { Award, HeartPulse, Moon, ShieldCheck } from 'lucide-react';
import { useLang } from '../i18n';
import { IMAGES } from '../data/content';
import { Img, Reveal, SectionHead } from './shared';

const ICONS = [Award, ShieldCheck, HeartPulse, Moon];

export default function WhyUs() {
  const { t } = useLang();
  return (
    <section className="section why">
      <div className="container why-grid">
        <div>
          <SectionHead eyebrow={t.why.eyebrow} title={t.why.title} center={false} />
          <div className="why-list">
            {t.why.items.map((item, i) => {
              const Icon = ICONS[i];
              return (
                <Reveal key={i} delay={i * 0.1} className="why-item">
                  <span className="why-icon">
                    <Icon size={22} />
                  </span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
        <Reveal x={40} y={0} className="why-visual">
          <Img src={IMAGES.clinic} alt="Dent-O-Shine clinic" className="why-img-main" />
          <Img src={IMAGES.clinic2} alt="Dental chair" className="why-img-small" />
        </Reveal>
      </div>
    </section>
  );
}
