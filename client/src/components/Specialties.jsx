import Reveal from './Reveal';
import { SPECIALTIES } from '../config/content';

export default function Specialties() {
  return (
    <section
      id="zt-specialties"
      className="relative z-10"
      style={{ background: '#f6efe1', borderTop: '1px solid rgba(44,40,35,.06)', borderBottom: '1px solid rgba(44,40,35,.06)', padding: 'clamp(48px,8vw,84px) clamp(20px,5vw,40px)', marginTop: 40 }}
    >
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <Reveal>
          <div className="text-center mx-auto mb-10" style={{ maxWidth: 640 }}>
            <p className="font-mono uppercase mb-3" style={{ fontSize: 13, letterSpacing: '.16em', color: '#8a4a20' }}>— תחומי טיפול</p>
            <h2 className="font-display font-medium text-ink mb-3" style={{ fontSize: 'clamp(28px,6vw,42px)', lineHeight: 1.15 }}>
              מקום לכל אתגר רגשי
            </h2>
            <p className="text-ink-soft" style={{ fontSize: 'clamp(15px,3vw,18px)', lineHeight: 1.6 }}>
              רקע רחב בטיפול במבוגרים ובנוער — מותאם לצורך, לגיל ולשלב בחיים.
            </p>
          </div>
        </Reveal>

        {/* Desktop: 2→3 col grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SPECIALTIES.map((c, i) => (
            <Reveal key={c.title} delay={[0,60,120,0,60,120][i]}>
              <div
                className="bg-paper h-full cursor-default transition-all duration-300 hover:-translate-y-1"
                style={{ border: '1px solid rgba(44,40,35,.07)', borderRadius: 18, padding: 'clamp(20px,4vw,28px)' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 20px 44px rgba(44,40,35,.12)'; e.currentTarget.style.borderColor = 'rgba(192,130,79,.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = 'rgba(44,40,35,.07)'; }}
              >
                <div className="flex items-center justify-center mb-4"
                  style={{ width: 46, height: 46, borderRadius: 13, background: c.tint, color: c.color, fontSize: 21 }}>{c.icon}</div>
                <h3 className="font-display font-bold text-ink mb-2" style={{ fontSize: 'clamp(18px,3vw,21px)' }}>{c.title}</h3>
                <p className="text-ink-soft" style={{ fontSize: 'clamp(14px,2.5vw,15.5px)', lineHeight: 1.65 }}>{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Mobile: horizontal snap scroll */}
        <div className="sm:hidden flex gap-4 overflow-x-auto pb-3"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', marginRight: -20, marginLeft: -20, paddingRight: 20, paddingLeft: 20 }}>
          {SPECIALTIES.map(c => (
            <div key={c.title} className="bg-paper flex flex-col flex-shrink-0"
              style={{ width: '80vw', scrollSnapAlign: 'start', border: '1px solid rgba(44,40,35,.07)', borderRadius: 18, padding: 20 }}>
              <div className="flex items-center justify-center mb-3"
                style={{ width: 44, height: 44, borderRadius: 12, background: c.tint, color: c.color, fontSize: 20 }}>{c.icon}</div>
              <h3 className="font-display font-bold text-ink mb-2" style={{ fontSize: 18 }}>{c.title}</h3>
              <p className="text-ink-soft" style={{ fontSize: 14.5, lineHeight: 1.65 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
