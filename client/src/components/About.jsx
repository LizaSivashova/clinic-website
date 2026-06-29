import Reveal from './Reveal';
import therapistPhoto from '../assets/therapist_placeholder.png';
import { ABOUT } from '../config/content';

export default function About() {
  return (
    <section id="zt-about" className="relative z-10 mx-auto" style={{ maxWidth: 1120, padding: 'clamp(40px,8vw,70px) clamp(20px,5vw,40px)' }}>
      <div className="grid grid-cols-1 md:grid-cols-[.8fr_1.2fr] gap-10 md:gap-14 items-center">

        {/* Portrait */}
        <Reveal>
          <div className="relative mx-auto w-full" style={{ maxWidth: 360 }}>
            <div
              className="rounded-3xl overflow-hidden border"
              style={{
                aspectRatio: '3/4',
                boxShadow: '0 24px 60px rgba(44,40,35,.18)',
                borderColor: 'rgba(255,255,255,.5)',
              }}
            >
              <img
                src={therapistPhoto}
                alt={ABOUT.photoAlt}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
              />
            </div>
            <div
              className="bob absolute font-display text-paper rounded-2xl"
              style={{
                bottom: -18, right: -12,
                background: '#3a5a40',
                padding: '12px 16px',
                boxShadow: '0 16px 40px rgba(58,90,64,.3)',
                fontSize: 'clamp(12px,2.5vw,15px)',
                lineHeight: 1.4,
              }}
            >
              {ABOUT.badge}<br />{ABOUT.badgeSub}
            </div>
          </div>
        </Reveal>

        {/* Text */}
        <Reveal delay={140}>
          <p className="font-mono uppercase mb-3"
            style={{ fontSize: 13, letterSpacing: '.14em', color: '#8a4a20' }}>— נעים להכיר</p>
          <h2 className="font-display font-medium text-ink"
            style={{ fontSize: 'clamp(30px,6vw,44px)', lineHeight: 1.12, margin: '0 0 6px' }}>
            {ABOUT.heading}
          </h2>
          <div style={{ width: 48, height: 3, borderRadius: 2, background: '#c0824f', margin: '0 0 20px' }} />

          <p className="text-ink-soft" style={{ fontSize: 'clamp(15px,2.5vw,17px)', lineHeight: 1.8, marginBottom: 16 }}>
            {ABOUT.bio1}
          </p>
          <p className="text-ink-soft" style={{ fontSize: 'clamp(15px,2.5vw,17px)', lineHeight: 1.8, marginBottom: 24 }}>
            {ABOUT.bio2}
          </p>

          <div style={{ borderRight: '3px solid rgba(192,130,79,.4)', paddingRight: 14, marginBottom: 24 }}>
            {ABOUT.credentials.map(c => (
              <p key={c} className="text-muted" style={{ fontSize: 13.5, lineHeight: 1.8, margin: 0 }}>{c}</p>
            ))}
          </div>

          <div className="flex gap-2.5 flex-wrap">
            {ABOUT.tags.map(p => (
              <span key={p.label} className="font-semibold rounded-full px-4 py-2"
                style={{ background: p.bg, color: p.color, fontSize: 13.5 }}>
                {p.label}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
