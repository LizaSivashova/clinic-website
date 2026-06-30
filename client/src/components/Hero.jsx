import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { HERO, THERAPIST } from '../config/content';

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 76, behavior: 'smooth' });
}

function Rev({ delay = 0, children }) {
  const [ref, vis] = useScrollAnimation({ threshold: 0.01 });
  return (
    <div ref={ref} className={`reveal${vis ? ' is-visible' : ''}`} style={{ transitionDelay: vis ? `${delay}ms` : '0ms' }}>
      {children}
    </div>
  );
}

export default function Hero() {
  return (
    <header
      id="zt-hero"
      className="relative z-10 mx-auto flex flex-col items-center justify-center text-center"
      style={{ maxWidth: 920, minHeight: '100svh', padding: 'clamp(96px,16vw,150px) clamp(20px,5vw,40px) clamp(48px,9vw,90px)' }}
    >
      {/* Badge */}
      <Rev delay={0}>
        <div
          className="inline-flex items-center gap-2 font-semibold text-forest mb-6"
          style={{ background: 'rgba(58,90,64,.1)', padding: '7px 14px', borderRadius: 999, fontSize: 'clamp(12px,3vw,13.5px)' }}
        >
          <span className="dot-pulse rounded-full bg-forest" style={{ width: 7, height: 7, display: 'inline-block', flexShrink: 0 }} />
          {HERO.badge} · 📍 {THERAPIST.city} · 💻 אונליין
        </div>
      </Rev>

      {/* H1 */}
      <Rev delay={80}>
        <h1
          className="font-display font-medium text-ink"
          style={{ fontSize: 'clamp(28px,9vw,72px)', lineHeight: 1.1, letterSpacing: '-.015em', margin: '0 0 22px', whiteSpace: 'nowrap' }}
        >
          {HERO.tagline}{' '}
          <span className="text-terracotta-deep italic font-bold">{HERO.taglineEm}</span>
        </h1>
      </Rev>

      {/* Subtitle */}
      <Rev delay={160}>
        <p className="text-ink-soft" style={{ fontSize: 'clamp(13.5px,3.6vw,21px)', lineHeight: 1.62, maxWidth: 520, margin: '0 auto 14px', textWrap: 'balance' }}>
          {HERO.subtitle}
        </p>
      </Rev>

      {/* Pull-quote */}
      <Rev delay={220}>
        <p className="font-display italic text-terracotta-deep" style={{ fontSize: 'clamp(10px,3.1vw,19px)', margin: '0 auto 32px', whiteSpace: 'nowrap' }}>
          {HERO.pullQuote}
        </p>
      </Rev>

      {/* CTAs */}
      <Rev delay={280}>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <button
            onClick={() => scrollTo('zt-contact')}
            className="font-semibold text-paper cursor-pointer transition-all hover:-translate-y-0.5"
            style={{ fontSize: 'clamp(15px,3.5vw,17px)', padding: 'clamp(12px,3vw,15px) clamp(22px,5vw,32px)', borderRadius: 999, border: 'none', background: '#3a5a40', boxShadow: '0 10px 28px rgba(58,90,64,.3)' }}
          >
            בואו נדבר
          </button>
          <button
            onClick={() => scrollTo('zt-process')}
            className="inline-flex items-center gap-2 font-semibold text-ink-nav hover:text-terracotta-deep transition-colors cursor-pointer"
            style={{ fontSize: 'clamp(14px,3vw,16px)', background: 'none', border: 'none' }}
          >
            <span className="flex items-center justify-center rounded-full text-terracotta-deep flex-shrink-0"
              style={{ width: 36, height: 36, border: '1.5px solid #c0824f' }}>↓</span>
            איך נראה התהליך
          </button>
        </div>
      </Rev>

      {/* Stats */}
      <Rev delay={340}>
        <div className="hero-stats flex items-center mt-10 justify-center flex-nowrap">
          {HERO.stats.map((s, i) => (
            <>
              <div key={s.label} style={{ padding: '0 clamp(10px,3vw,36px)', textAlign: 'center' }}>
                <div className="font-display font-bold text-forest" style={{ fontSize: 'clamp(14px,3.5vw,32px)', whiteSpace: 'nowrap' }}>{s.value}</div>
                <div className="text-muted" style={{ fontSize: 'clamp(10px,2.2vw,14px)', whiteSpace: 'nowrap' }}>{s.label}</div>
              </div>
              {i < HERO.stats.length - 1 && (
                <div key={`div-${i}`} style={{ width: 1, height: 36, background: 'rgba(44,40,35,.14)', flexShrink: 0 }} />
              )}
            </>
          ))}
        </div>
      </Rev>
    </header>
  );
}
