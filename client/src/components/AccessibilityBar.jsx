import { useState, useEffect, useRef } from 'react';
import { applyFontScale } from '../utils/a11yFont';

const FEATURES = [
  {
    key: 'highContrast',
    label: 'ניגודיות גבוהה',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M12 3a9 9 0 1 0 0 18A9 9 0 0 0 12 3zm0 16V5a7 7 0 0 1 0 14z" />
      </svg>
    ),
  },
  {
    key: 'grayscale',
    label: 'גווני אפור',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4v16" strokeWidth="2.5" />
        <path d="M4 12h16" />
      </svg>
    ),
  },
  {
    key: 'underlineLinks',
    label: 'קו תחת קישורים',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <text x="4" y="16" fontSize="14" fontWeight="700" fontFamily="Arial" style={{ textDecoration: 'underline' }}>U</text>
        <rect x="3" y="18" width="11" height="2" rx="1" />
      </svg>
    ),
  },
  {
    key: 'readableFont',
    label: 'גופן קריא',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <text x="1" y="16" fontSize="13" fontWeight="700" fontFamily="Arial, sans-serif">Aa</text>
      </svg>
    ),
  },
  {
    key: 'stopAnimations',
    label: 'עצור אנימציות',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <rect x="6" y="5" width="4" height="14" rx="1" />
        <rect x="14" y="5" width="4" height="14" rx="1" />
      </svg>
    ),
  },
];

const FONT_STEPS = [1, 1.25, 1.5, 1.75, 2]; // 0 = normal, then 4 enlargement levels

const DEFAULT = {
  fontLevel: 0,
  highContrast: false,
  grayscale: false,
  underlineLinks: false,
  readableFont: false,
  stopAnimations: false,
};

function applySettings(s) {
  const html = document.documentElement;
  // zoom mis-scales vw/clamp text on WebKit; use the engine-agnostic scaler.
  applyFontScale(FONT_STEPS[s.fontLevel] || 1);
  html.classList.toggle('a11y-contrast',    s.highContrast);
  html.classList.toggle('a11y-grayscale',   s.grayscale);
  html.classList.toggle('a11y-links',       s.underlineLinks);
  html.classList.toggle('a11y-font',        s.readableFont);
  html.classList.toggle('a11y-no-motion',   s.stopAnimations);
}

export default function AccessibilityBar() {
  const [open, setOpen]       = useState(false);
  const [settings, setSettings] = useState(() => {
    try { return { ...DEFAULT, ...JSON.parse(localStorage.getItem('a11y') || '{}') }; }
    catch { return DEFAULT; }
  });
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    applySettings(settings);
    try { localStorage.setItem('a11y', JSON.stringify(settings)); } catch {}
  }, [settings]);

  useEffect(() => {
    if (open) {
      panelRef.current?.focus();
    }
    const onKey = e => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const toggle = key => setSettings(s => ({ ...s, [key]: !s[key] }));
  const reset  = () => setSettings(DEFAULT);
  const setFont = dir => setSettings(s => ({
    ...s,
    fontLevel: Math.min(FONT_STEPS.length - 1, Math.max(0, s.fontLevel + dir)),
  }));
  const anyActive = Object.values(settings).some(Boolean);

  return (
    <>
      {/* Floating trigger button */}
      <button
        ref={triggerRef}
        data-a11y-skip
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'סגור סרגל נגישות' : 'פתח סרגל נגישות'}
        aria-expanded={open}
        aria-controls="a11y-panel"
        style={{
          position: 'fixed',
          bottom: 26,
          left: 100,
          zIndex: 50,
          width: 60,
          height: 60,
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          background: '#1a5fa8',
          boxShadow: '0 8px 24px rgba(26,95,168,.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: open ? 0 : 1,
          pointerEvents: open ? 'none' : 'auto',
          transition: 'transform .2s, box-shadow .2s, opacity .2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        {anyActive && (
          <span style={{
            position: 'absolute',
            top: 4, right: 4,
            width: 12, height: 12,
            borderRadius: '50%',
            background: '#f0c040',
            border: '2px solid #1a5fa8',
          }} aria-hidden="true" />
        )}
        {/* Accessibility person icon */}
        <svg viewBox="0 0 40 40" width="32" height="32" fill="white" aria-hidden="true">
          <circle cx="20" cy="8" r="5" />
          <path d="M20 15 C12 15 8 21 8 21 L15 21 L15 35 L25 35 L25 21 L32 21 C32 21 28 15 20 15 Z" />
        </svg>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          aria-hidden="true"
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 48,
            background: 'rgba(0,0,0,.35)',
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Side panel */}
      <div
        id="a11y-panel"
        data-a11y-skip
        ref={panelRef}
        role="dialog"
        aria-label="כלי נגישות"
        aria-modal="true"
        tabIndex={-1}
        dir="rtl"
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          width: 280,
          zIndex: 49,
          display: 'flex',
          flexDirection: 'column',
          background: '#fff',
          boxShadow: '6px 0 40px rgba(0,0,0,.2)',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform .3s cubic-bezier(.4,0,.2,1)',
          outline: 'none',
        }}
      >
        {/* Header */}
        <div style={{
          background: '#1a5fa8',
          color: '#fff',
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg viewBox="0 0 40 40" width="24" height="24" fill="white" aria-hidden="true">
              <circle cx="20" cy="8" r="5" />
              <path d="M20 15 C12 15 8 21 8 21 L15 21 L15 35 L25 35 L25 21 L32 21 C32 21 28 15 20 15 Z" />
            </svg>
            <span style={{ fontFamily: '"Heebo", sans-serif', fontWeight: 700, fontSize: 18 }}>
              כלי נגישות
            </span>
          </div>
          <button
            onClick={() => { setOpen(false); triggerRef.current?.focus(); }}
            aria-label="סגור סרגל נגישות"
            style={{
              background: 'rgba(255,255,255,.15)',
              border: 'none',
              color: '#fff',
              width: 32,
              height: 32,
              borderRadius: '50%',
              fontSize: 20,
              cursor: 'pointer',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.28)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.15)'; }}
          >
            ✕
          </button>
        </div>

        {/* Feature grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          <p style={{
            fontSize: 12,
            color: '#888',
            margin: '0 0 12px',
            fontFamily: '"Heebo", sans-serif',
          }}>
            בחר/י את ההתאמות הדרושות לך
          </p>

          {/* Text size stepper */}
          <div style={{
            border: settings.fontLevel ? '2px solid #1a5fa8' : '2px solid rgba(0,0,0,.1)',
            background: settings.fontLevel ? 'rgba(26,95,168,.09)' : '#f6f6f6',
            borderRadius: 14,
            padding: '12px 14px',
            marginBottom: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            transition: 'all .18s',
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              fontFamily: '"Heebo", sans-serif',
              color: settings.fontLevel ? '#1a5fa8' : '#444',
            }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>גודל טקסט</span>
              <span style={{ fontSize: 11, color: '#888' }}>
                {settings.fontLevel ? `רמה ${settings.fontLevel} מתוך ${FONT_STEPS.length - 1}` : 'רגיל'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={() => setFont(-1)}
                disabled={settings.fontLevel === 0}
                aria-label="הקטן גודל טקסט"
                style={{
                  width: 34, height: 34, borderRadius: 9,
                  border: '1.5px solid rgba(0,0,0,.15)',
                  background: '#fff',
                  cursor: settings.fontLevel === 0 ? 'default' : 'pointer',
                  opacity: settings.fontLevel === 0 ? 0.4 : 1,
                  fontSize: 20, fontWeight: 700, lineHeight: 1,
                  color: '#1a5fa8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                −
              </button>
              <button
                onClick={() => setFont(1)}
                disabled={settings.fontLevel === FONT_STEPS.length - 1}
                aria-label="הגדל גודל טקסט"
                style={{
                  width: 34, height: 34, borderRadius: 9,
                  border: '1.5px solid rgba(0,0,0,.15)',
                  background: '#fff',
                  cursor: settings.fontLevel === FONT_STEPS.length - 1 ? 'default' : 'pointer',
                  opacity: settings.fontLevel === FONT_STEPS.length - 1 ? 0.4 : 1,
                  fontSize: 20, fontWeight: 700, lineHeight: 1,
                  color: '#1a5fa8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                +
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {FEATURES.map(f => {
              const active = settings[f.key];
              return (
                <button
                  key={f.key}
                  onClick={() => toggle(f.key)}
                  aria-pressed={active}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    padding: '16px 10px',
                    borderRadius: 14,
                    cursor: 'pointer',
                    border: active ? '2px solid #1a5fa8' : '2px solid rgba(0,0,0,.1)',
                    background: active ? 'rgba(26,95,168,.09)' : '#f6f6f6',
                    color: active ? '#1a5fa8' : '#444',
                    fontSize: 12,
                    fontFamily: '"Heebo", sans-serif',
                    fontWeight: 600,
                    lineHeight: 1.3,
                    textAlign: 'center',
                    transition: 'all .18s',
                  }}
                >
                  <span aria-hidden="true">{f.icon}</span>
                  {f.label}
                  {active && (
                    <span style={{
                      fontSize: 10,
                      background: '#1a5fa8',
                      color: '#fff',
                      borderRadius: 999,
                      padding: '1px 6px',
                    }}>
                      פעיל
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid rgba(0,0,0,.08)',
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          flexShrink: 0,
        }}>
          <button
            onClick={reset}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: 10,
              border: '1.5px solid rgba(0,0,0,.15)',
              background: '#fff',
              cursor: 'pointer',
              fontFamily: '"Heebo", sans-serif',
              fontSize: 14,
              color: '#555',
              transition: 'background .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f0f0f0'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
          >
            איפוס הכל
          </button>
          <a
            href="/accessibility"
            style={{
              textAlign: 'center',
              fontSize: 13,
              color: '#1a5fa8',
              textDecoration: 'underline',
              fontFamily: '"Heebo", sans-serif',
            }}
          >
            הצהרת נגישות
          </a>
        </div>
      </div>
    </>
  );
}
