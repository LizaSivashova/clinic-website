import Reveal from './Reveal';

const STEPS = [
  { num: '01', title: 'פנייה ראשונית',  desc: 'משאירים פרטים בטופס או בוואטסאפ. אחזור אליכם תוך יום עסקים, ללא כל התחייבות.' },
  { num: '02', title: 'פגישת היכרות',  desc: 'נכיר, נבין מה מביא אתכם ונבדוק יחד האם הכימיה והגישה מתאימות לכם.' },
  { num: '03', title: 'בניית תכנית',   desc: 'נגדיר מטרות ברורות ונבנה מסלול טיפול אישי — CBT, רגשי או שילוב של השניים.' },
  { num: '04', title: 'תהליך טיפולי',  desc: 'פגישות שבועיות במרחב חם ובטוח, עם כלים שמלווים אתכם גם בין המפגשים.' },
  { num: '05', title: 'צמיחה והמשך',  desc: 'מסכמים את הדרך שעברתם, מבססים את ההישגים ובונים חוסן להמשך החיים.' },
];

export default function Timeline() {
  return (
    <section id="zt-process" className="relative z-10 overflow-hidden"
      style={{ background: '#3a5a40', color: '#eef2e8', padding: 'clamp(52px,8vw,88px) clamp(20px,5vw,40px)' }}>
      <div aria-hidden="true" className="absolute top-[-120px] left-[-90px] w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(192,130,79,.2),transparent 65%)' }} />

      <div className="relative mx-auto" style={{ maxWidth: 800 }}>
        {/* Header */}
        <Reveal>
          <div className="text-center mx-auto mb-12" style={{ maxWidth: 560 }}>
            <p className="font-mono uppercase mb-3" style={{ fontSize: 13, letterSpacing: '.16em', color: '#e0c090' }}>— התהליך</p>
            <h2 style={{ fontFamily: '"Yeseva One", serif', fontWeight: 400, fontSize: 'clamp(26px,6vw,42px)', lineHeight: 1.15, color: '#fbf7ef', margin: 0 }}>
              חמישה שלבים, בקצב שלך
            </h2>
          </div>
        </Reveal>

        {/* Vertical timeline */}
        <div style={{ position: 'relative', paddingRight: 28, borderRight: '2px solid rgba(238,242,232,.22)', display: 'flex', flexDirection: 'column', gap: 28 }}>
          {STEPS.map((st, i) => (
            <Reveal key={st.num} delay={i * 80}>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', right: -39, top: 4,
                  width: 20, height: 20, borderRadius: '50%',
                  background: '#c0824f', border: '3px solid #3a5a40',
                  boxShadow: '0 0 0 4px rgba(192,130,79,.25)', display: 'block', flexShrink: 0,
                }} />
                <div className="flex items-baseline gap-3 mb-1">
                  <span style={{ fontFamily: '"Yeseva One", serif', fontWeight: 500, fontSize: 14, color: '#d6b58c' }}>{st.num}</span>
                  <h3 style={{ fontFamily: '"Yeseva One", serif', fontWeight: 700, fontSize: 'clamp(18px,3.5vw,22px)', color: '#fbf7ef', margin: 0 }}>{st.title}</h3>
                </div>
                <p style={{ fontSize: 'clamp(14px,2.5vw,15.5px)', lineHeight: 1.65, color: '#cbd6c2', margin: 0, maxWidth: 520 }}>{st.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
