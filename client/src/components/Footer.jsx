import { useNavigate } from 'react-router-dom';
import { THERAPIST, FOOTER } from '../config/content';

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-8"
          style={{ borderBottom: '1px solid rgba(216,207,190,.14)' }}>

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center justify-center rounded-full text-ink flex-shrink-0"
                style={{ width: 38, height: 38, background: '#c0824f', fontSize: 19, fontFamily: '"Heebo", sans-serif', fontWeight: 800 }}>{THERAPIST.initial}</span>
              <span style={{ fontSize: 20, color: '#fbf7ef', fontFamily: '"Heebo", sans-serif', fontWeight: 800 }}>{THERAPIST.name}</span>
            </div>
            <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#b3a994', maxWidth: 300, margin: 0 }}>
              {FOOTER.description}
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="font-mono uppercase mb-3" style={{ fontSize: 10.5, letterSpacing: '.16em', color: '#b3a994' }}>ניווט</p>
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
            <p className="font-mono uppercase mb-3" style={{ fontSize: 10.5, letterSpacing: '.16em', color: '#b3a994' }}>פרטי קשר</p>
            <div style={{ fontSize: 14.5, lineHeight: 1.9, color: '#b3a994' }}>
              <a href={THERAPIST.phoneHref} style={{ color: '#b3a994', textDecoration: 'none', display: 'block', direction: 'ltr', textAlign: 'right' }}>{THERAPIST.phone}</a>
              <a href={`mailto:${THERAPIST.email}`} style={{ color: '#b3a994', textDecoration: 'none', display: 'block' }}>{THERAPIST.email}</a>
              <span style={{ display: 'block' }}>{THERAPIST.address}</span>
              <span style={{ display: 'block' }}>מענה גם בזום</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-wrap justify-between items-center gap-2 pt-5"
          style={{ fontSize: 12.5, color: '#b3a994' }}>
          <span>© {THERAPIST.copyrightYear} {THERAPIST.name} · כל הזכויות שמורות</span>
          <button onClick={() => navigate('/admin/login')}
            className="font-mono cursor-pointer hover:text-muted-light transition-colors"
            style={{ fontSize: 11.5, color: '#b3a994', background: 'none', border: 'none' }}>
            admin →
          </button>
        </div>
      </div>
    </footer>
  );
}
