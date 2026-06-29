import Reveal from './Reveal';

const CARDS = [
  { quote: 'הגעתי שבורה אחרי תקופה קשה. ישראלה נתנה לי כלים אמיתיים ויחס חם שאי אפשר לתאר. היום אני נושמת אחרת.',    initial: 'מ', name: 'מ., בת 34', tag: 'טיפול בחרדה',  tint: 'rgba(192,130,79,.16)', color: '#a86a3a', delay: 0   },
  { quote: 'כהורים היינו אבודים מול הבן המתבגר. ההדרכה שינתה את כל הדינמיקה בבית. סוף סוף מקשיבים אחד לשני.',     initial: 'ד', name: 'ד. ונ.',    tag: 'הדרכת הורים', tint: 'rgba(58,90,64,.12)',   color: '#3a5a40', delay: 90  },
  { quote: 'מקצועיות וחמלה במינון מושלם. ישראלה ראתה אותי גם כשאני לא הצלחתי לראות את עצמי. תודה על הכול.',        initial: 'ש', name: 'ש., בת 41', tag: 'טיפול רגשי',  tint: 'rgba(192,130,79,.16)', color: '#a86a3a', delay: 180 },
];

export default function Testimonials() {
  return (
    <section id="zt-testimonials" className="relative z-10" style={{ padding: 'clamp(48px,8vw,88px) clamp(20px,5vw,40px)' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>
        <Reveal>
          <div className="text-center mx-auto mb-10" style={{ maxWidth: 600 }}>
            <p className="font-mono uppercase mb-3" style={{ fontSize: 13, letterSpacing: '.16em', color: '#8a4a20' }}>— מילים ממטופלים</p>
            <h2 className="font-display font-medium text-ink m-0" style={{ fontSize: 'clamp(28px,6vw,42px)', lineHeight: 1.15 }}>
              השינוי, במילים שלהם
            </h2>
          </div>
        </Reveal>

        {/* Mobile: horizontal snap scroll. Desktop: 3-col grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-5">
          {CARDS.map(c => (
            <Reveal key={c.name} delay={c.delay}>
              <div className="bg-paper flex flex-col h-full"
                style={{ border: '1px solid rgba(44,40,35,.07)', borderRadius: 20, padding: 28, boxShadow: '0 10px 30px rgba(44,40,35,.06)' }}>
                <div className="font-display text-terracotta" style={{ fontSize: 42, lineHeight: .6, marginBottom: 12 }}>״</div>
                <p className="text-ink-nav flex-1" style={{ fontSize: 16, lineHeight: 1.66, margin: '0 0 20px' }}>{c.quote}</p>
                <div className="flex items-center gap-3" style={{ borderTop: '1px solid rgba(44,40,35,.08)', paddingTop: 16 }}>
                  <span className="flex items-center justify-center font-display font-bold rounded-full flex-shrink-0"
                    style={{ width: 40, height: 40, background: c.tint, color: c.color, fontSize: 17 }}>{c.initial}</span>
                  <div>
                    <div className="font-bold text-ink" style={{ fontSize: 14 }}>{c.name}</div>
                    <div className="text-muted" style={{ fontSize: 12.5 }}>{c.tag}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Mobile horizontal scroll */}
        <div className="md:hidden flex gap-4 overflow-x-auto pb-3" style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', marginRight: -20, marginLeft: -20, paddingRight: 20, paddingLeft: 20 }}>
          {CARDS.map(c => (
            <div key={c.name} className="bg-paper flex flex-col flex-shrink-0"
              style={{ width: 'calc(85vw)', scrollSnapAlign: 'start', border: '1px solid rgba(44,40,35,.07)', borderRadius: 20, padding: 22, boxShadow: '0 8px 24px rgba(44,40,35,.07)' }}>
              <div className="font-display text-terracotta" style={{ fontSize: 38, lineHeight: .6, marginBottom: 12 }}>״</div>
              <p className="text-ink-nav flex-1" style={{ fontSize: 15, lineHeight: 1.66, margin: '0 0 18px' }}>{c.quote}</p>
              <div className="flex items-center gap-3" style={{ borderTop: '1px solid rgba(44,40,35,.08)', paddingTop: 14 }}>
                <span className="flex items-center justify-center font-display font-bold rounded-full flex-shrink-0"
                  style={{ width: 38, height: 38, background: c.tint, color: c.color, fontSize: 16 }}>{c.initial}</span>
                <div>
                  <div className="font-bold text-ink" style={{ fontSize: 13.5 }}>{c.name}</div>
                  <div className="text-muted" style={{ fontSize: 12 }}>{c.tag}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
