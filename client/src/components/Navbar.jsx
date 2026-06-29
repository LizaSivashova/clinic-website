import { useEffect, useState } from 'react';
import { THERAPIST } from '../config/content';

const NAV_LINKS = [
  { label: 'אודות',       id: 'zt-about' },
  { label: 'תחומי טיפול', id: 'zt-specialties' },
  { label: 'התהליך',      id: 'zt-process' },
  { label: 'המלצות',      id: 'zt-testimonials' },
  { label: 'יצירת קשר',   id: 'zt-contact' },
];

function scrollTo(id, close) {
  close?.();
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 76, behavior: 'smooth' });
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 1024) setOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">דלג לתוכן הראשי</a>
      <nav
        dir="rtl"
        className="fixed inset-x-0 top-0 z-30 flex items-center justify-between transition-shadow duration-300"
        style={{
          padding: '14px 20px',
          background: 'rgba(241,233,218,.92)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(44,40,35,.08)',
          boxShadow: scrolled ? '0 2px 12px rgba(44,40,35,.06)' : 'none',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => { setOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-2.5 cursor-pointer"
          style={{ background: 'none', border: 'none' }}
        >
          <span
            className="flex items-center justify-center rounded-full text-paper flex-shrink-0"
            style={{ width: 38, height: 38, background: '#3a5a40', fontSize: 20, fontFamily: '"Heebo", sans-serif', fontWeight: 800 }}
          >
            {THERAPIST.initial}
          </span>
          <span className="flex flex-col leading-tight" style={{ textAlign: 'right' }}>
            <span className="text-ink" style={{ fontFamily: '"Heebo", sans-serif', fontWeight: 800, fontSize: 19, letterSpacing: '.02em' }}>{THERAPIST.name}</span>
            <span className="font-mono uppercase text-muted hidden sm:block" style={{ fontSize: 8.5, letterSpacing: '.16em' }}>
              {THERAPIST.navSubtitle}
            </span>
          </span>
        </button>

        {/* Desktop center links */}
        <div className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map(l => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="text-ink-nav font-medium cursor-pointer hover:text-terracotta-deep transition-colors duration-200"
              style={{ fontSize: 15, background: 'none', border: 'none' }}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={() => scrollTo('zt-contact')}
            className="font-semibold text-paper cursor-pointer transition-all hover:-translate-y-0.5"
            style={{ fontSize: 14, padding: '10px 20px', borderRadius: 999, background: '#c0824f', border: 'none', boxShadow: '0 6px 18px rgba(192,130,79,.32)' }}
          >
            קביעת פגישה
          </button>
        </div>

        {/* Mobile: CTA + hamburger */}
        <div className="flex lg:hidden items-center gap-3">
          <button
            onClick={() => scrollTo('zt-contact')}
            className="font-semibold text-paper cursor-pointer"
            style={{ fontSize: 13, padding: '9px 16px', borderRadius: 999, background: '#9a5e2e', border: 'none' }}
          >
            קביעת פגישה
          </button>
          <button
            onClick={() => setOpen(o => !o)}
            aria-label="תפריט"
            className="flex flex-col justify-center items-center gap-1.5 cursor-pointer"
            style={{ width: 36, height: 36, background: 'none', border: 'none', padding: 4 }}
          >
            <span style={{ display: 'block', width: 22, height: 2, background: '#2c2823', borderRadius: 2, transition: 'all .2s', transform: open ? 'rotate(45deg) translateY(6px)' : 'none' }} />
            <span style={{ display: 'block', width: 22, height: 2, background: '#2c2823', borderRadius: 2, transition: 'all .2s', opacity: open ? 0 : 1 }} />
            <span style={{ display: 'block', width: 22, height: 2, background: '#2c2823', borderRadius: 2, transition: 'all .2s', transform: open ? 'rotate(-45deg) translateY(-6px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        dir="rtl"
        className="fixed inset-x-0 top-0 z-20 lg:hidden"
        style={{
          background: 'rgba(251,247,239,.98)',
          backdropFilter: 'blur(12px)',
          paddingTop: 70,
          paddingBottom: 30,
          transform: open ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform .3s cubic-bezier(.4,0,.2,1)',
          boxShadow: open ? '0 8px 40px rgba(44,40,35,.12)' : 'none',
        }}
      >
        <div className="flex flex-col" style={{ padding: '10px 24px 0' }}>
          {NAV_LINKS.map(l => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id, () => setOpen(false))}
              className="text-ink font-medium cursor-pointer text-right transition-colors hover:text-terracotta-deep"
              style={{ fontSize: 20, padding: '14px 0', background: 'none', border: 'none', borderBottom: '1px solid rgba(44,40,35,.07)' }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Backdrop */}
      {open && <div className="fixed inset-0 z-10 lg:hidden" onClick={() => setOpen(false)} />}
    </>
  );
}
