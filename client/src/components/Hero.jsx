import { useScrollAnimation } from '../hooks/useScrollAnimation';

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
      className="relative z-10 mx-auto flex flex-col items-center text-center"
      style={{ maxWidth: 920, padding: 'clamp(110px,18vw,190px) clamp(20px,5vw,40px) clamp(60px,10vw,110px)' }}
    >
      {/* Badge */}
      <Rev delay={0}>
        <div
          className="inline-flex items-center gap-2 font-semibold text-forest mb-6"
          style={{ background: 'rgba(58,90,64,.1)', padding: '7px 14px', borderRadius: 999, fontSize: 'clamp(12px,3vw,13.5px)' }}
        >
          <span className="dot-pulse rounded-full bg-forest" style={{ width: 7, height: 7, display: 'inline-block', flexShrink: 0 }} />
          מקבלת פניות חדשות · פגישה ראשונה ללא התחייבות
        </div>
      </Rev>

      {/* H1 */}
      <Rev delay={80}>
        <h1
          className="font-display font-medium text-ink"
          style={{ fontSize: 'clamp(38px,8vw,72px)', lineHeight: 1.1, letterSpacing: '-.015em', margin: '0 0 22px' }}
        >
          טיפול רגשי{' '}
          <span className="text-terracotta-deep italic font-bold">בגובה עיניים</span>
        </h1>
      </Rev>

      {/* Subtitle */}
      <Rev delay={160}>
        <p className="text-ink-soft" style={{ fontSize: 'clamp(16px,4vw,21px)', lineHeight: 1.62, maxWidth: 560, margin: '0 0 14px' }}>
          כשהחיים מרגישים מורכבים – לא חייבים להתמודד עם הכול לבד.<br className="hidden sm:block" />{' '}
          טיפול משולב CBT וטיפול דינמי, במרחב חם ובטוח.
        </p>
      </Rev>

      {/* Pull-quote */}
      <Rev delay={220}>
        <p className="font-display italic text-terracotta-deep" style={{ fontSize: 'clamp(15px,3.5vw,19px)', margin: '0 0 32px' }}>
          ״הטיפול הנכון מתחיל במקום שבו יש הקשבה, אמון ונוכחות אמיתית.״
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

      {/* Stats — forced single row, font scales down on small screens */}
      <Rev delay={340}>
        <div className="flex items-center mt-10 justify-center flex-nowrap">
          <div style={{ padding: '0 clamp(10px,3vw,36px)', textAlign: 'center' }}>
            <div className="font-display font-bold text-forest" style={{ fontSize: 'clamp(20px,5vw,32px)', whiteSpace: 'nowrap' }}>+20</div>
            <div className="text-muted" style={{ fontSize: 'clamp(10px,2.2vw,14px)', whiteSpace: 'nowrap' }}>שנות ניסיון</div>
          </div>
          <div style={{ width: 1, height: 36, background: 'rgba(44,40,35,.14)', flexShrink: 0 }} />
          <div style={{ padding: '0 clamp(10px,3vw,36px)', textAlign: 'center' }}>
            <div className="font-display font-bold text-forest" style={{ fontSize: 'clamp(14px,3.5vw,28px)', whiteSpace: 'nowrap' }}>מבוגרים ונוער</div>
            <div className="text-muted" style={{ fontSize: 'clamp(10px,2.2vw,14px)', whiteSpace: 'nowrap' }}>פרטני וזוגי</div>
          </div>
          <div style={{ width: 1, height: 36, background: 'rgba(44,40,35,.14)', flexShrink: 0 }} />
          <div style={{ padding: '0 clamp(10px,3vw,36px)', textAlign: 'center' }}>
            <div className="font-display font-bold text-forest" style={{ fontSize: 'clamp(20px,5vw,32px)', whiteSpace: 'nowrap' }}>CBT</div>
            <div className="text-muted" style={{ fontSize: 'clamp(10px,2.2vw,14px)', whiteSpace: 'nowrap' }}>גישה אינטגרטיבית</div>
          </div>
        </div>
      </Rev>
    </header>
  );
}
