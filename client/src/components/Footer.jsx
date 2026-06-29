import { useNavigate } from 'react-router-dom';

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 76, behavior: 'smooth' });
}

const NAV = [
  { label: 'אודות',       id: 'zt-about' },
  { label: 'תחומי טיפול', id: 'zt-specialties' },
  { label: 'התהליך',      id: 'zt-process' },
  { label: 'המלצות',      id: 'zt-testimonials' },
  { label: 'יצירת קשר',   id: 'zt-contact' },
];

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="relative z-10" style={{ background: '#2c2823', color: '#d8cfbe', padding: 'clamp(36px,6vw,54px) clamp(20px,5vw,40px) 28px' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>
        {/* Three columns — stack on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-8"
          style={{ borderBottom: '1px solid rgba(216,207,190,.14)' }}>
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center justify-center rounded-full font-display font-bold text-ink flex-shrink-0"
                style={{ width: 38, height: 38, background: '#c0824f', fontSize: 19 }}>צ</span>
              <span className="font-display font-bold" style={{ fontSize: 20, color: '#fbf7ef' }}>ישראלה ישראלי</span>
            </div>
            <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#b3a994', maxWidth: 300, margin: 0 }}>
              עובדת סוציאלית קלינית, מומחית לטיפול בטראומה ויועצת זוגית מוסמכת. טיפול רגשי בגובה עיניים — למבוגרים, נוער וזוגות, תל אביב והסביבה.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="font-mono uppercase mb-3" style={{ fontSize: 10.5, letterSpacing: '.16em', color: '#8a7a64' }}>ניווט</p>
            <div className="flex flex-col gap-2">
              {NAV.map(l => (
                <button key={l.id} onClick={() => scrollTo(l.id)}
                  className="text-right cursor-pointer hover:text-paper transition-colors"
                  style={{ fontSize: 14.5, color: '#d8cfbe', background: 'none', border: 'none', padding: 0 }}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="font-mono uppercase mb-3" style={{ fontSize: 10.5, letterSpacing: '.16em', color: '#8a7a64' }}>פרטי קשר</p>
            <div style={{ fontSize: 14.5, lineHeight: 1.9, color: '#b3a994' }}>
              <a href="tel:0501234567" style={{ color: '#b3a994', textDecoration: 'none', display: 'block', direction: 'ltr', textAlign: 'right' }}>050-1234567</a>
              <a href="mailto:demo@example.com" style={{ color: '#b3a994', textDecoration: 'none', display: 'block' }}>demo@example.com</a>
              <span style={{ display: 'block' }}>רחוב הדוגמה 1, תל אביב</span>
              <span style={{ display: 'block' }}>מענה גם בזום</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-wrap justify-between items-center gap-2 pt-5"
          style={{ fontSize: 12.5, color: '#8a7a64' }}>
          <span>© 2026 ישראלה ישראלי · כל הזכויות שמורות</span>
          <button onClick={() => navigate('/admin/login')}
            className="font-mono cursor-pointer hover:text-muted-light transition-colors"
            style={{ fontSize: 11.5, color: '#8a7a64', background: 'none', border: 'none' }}>
            admin →
          </button>
        </div>
      </div>
    </footer>
  );
}
