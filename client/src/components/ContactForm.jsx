import { useState } from 'react';
import Reveal from './Reveal';
import { THERAPIST, CONTACT_TOPICS } from '../config/content';

const EMPTY = { name: '', phone: '', topic: CONTACT_TOPICS[0], message: '' };

const INPUT = {
  width: '100%', border: '1.5px solid rgba(44,40,35,.14)', borderRadius: 11,
  padding: '12px 14px', fontSize: 15, background: '#fff', color: '#2c2823',
  outline: 'none', fontFamily: 'inherit',
};

export default function ContactForm() {
  const [form, setForm]     = useState(EMPTY);
  const [status, setStatus] = useState('idle');

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res  = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok && data.ok) { setStatus('sent'); setForm(EMPTY); }
      else setStatus('error');
    } catch { setStatus('error'); }
  };

  const focus = e => (e.target.style.borderColor = '#c0824f');
  const blur  = e => (e.target.style.borderColor = 'rgba(44,40,35,.14)');

  return (
    <section id="zt-contact" className="relative z-10"
      style={{ background: '#f6efe1', borderTop: '1px solid rgba(44,40,35,.06)', padding: 'clamp(48px,8vw,88px) clamp(20px,5vw,40px)' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start" style={{ maxWidth: 1080, margin: '0 auto' }}>

        {/* Info */}
        <Reveal>
          <p className="font-mono uppercase mb-3" style={{ fontSize: 13, letterSpacing: '.16em', color: '#8a4a20' }}>— יצירת קשר</p>
          <h2 className="font-display font-medium text-ink mb-4" style={{ fontSize: 'clamp(28px,6vw,42px)', lineHeight: 1.14 }}>
            בואו נדבר <br />אני כאן בשבילכם
          </h2>
          <p className="text-ink-soft mb-8" style={{ fontSize: 'clamp(15px,2.5vw,18px)', lineHeight: 1.66, maxWidth: 420 }}>
            אני מזמינה אותך ליצור קשר לשיחת היכרות  <br />
            ולגלות איך אפשר לעזור לך להתמודד, להתחזק <br />
            ולמצוא מחדש יציבות וביטחון.
          </p>

          <div className="flex flex-col gap-4">
            {[
              { icon: '✆', bg: 'rgba(58,90,64,.1)',   color: '#3a5a40', label: 'טלפון',   value: THERAPIST.phone,   href: THERAPIST.phoneHref, ltr: true  },
              { icon: '✉', bg: 'rgba(192,130,79,.12)', color: '#a86a3a', label: 'דוא״ל',  value: THERAPIST.email,   href: `mailto:${THERAPIST.email}`, ltr: true  },
              { icon: '⌖', bg: 'rgba(58,90,64,.1)',   color: '#3a5a40', label: 'קליניקה', value: THERAPIST.address, href: null, ltr: false },
            ].map(row => (
              <div key={row.label} className="flex items-center gap-3">
                <span className="flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ width: 44, height: 44, background: row.bg, color: row.color, fontSize: 19 }}>{row.icon}</span>
                <div>
                  <div className="text-muted" style={{ fontSize: 12.5 }}>{row.label}</div>
                  <div className="font-semibold text-ink" style={{ fontSize: 15, direction: row.ltr ? 'ltr' : undefined, textAlign: row.ltr ? 'right' : undefined }}>{row.value}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Form card */}
        <Reveal delay={140}>
          <div className="bg-paper"
            style={{ border: '1px solid rgba(44,40,35,.08)', borderRadius: 22, padding: 'clamp(22px,5vw,34px)', boxShadow: '0 24px 60px rgba(44,40,35,.1)' }}>
            {status === 'sent' ? (
              <div className="flex flex-col items-center text-center" style={{ padding: '32px 10px' }}>
                <div className="flex items-center justify-center rounded-full text-forest mb-4"
                  style={{ width: 68, height: 68, background: 'rgba(58,90,64,.12)', fontSize: 32 }}>✓</div>
                <h3 className="font-display text-ink mb-2" style={{ fontSize: 24 }}>הפנייה נשלחה</h3>
                <p className="text-ink-soft mb-5" style={{ fontSize: 15 }}>תודה שפניתם. אחזור אליכם בהקדם.</p>
                <button onClick={() => setStatus('idle')}
                  className="cursor-pointer font-semibold text-terracotta-deep"
                  style={{ border: '1.5px solid #c0824f', background: 'transparent', padding: '11px 22px', borderRadius: 999, fontSize: 15 }}>
                  שליחת פנייה נוספת
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-1.5 font-semibold text-ink-nav" style={{ fontSize: 14 }}>
                    שם מלא
                    <input required value={form.name} onChange={set('name')} placeholder="השם שלך"
                      style={INPUT} onFocus={focus} onBlur={blur} />
                  </label>
                  <label className="flex flex-col gap-1.5 font-semibold text-ink-nav" style={{ fontSize: 14 }}>
                    טלפון
                    <input required value={form.phone} onChange={set('phone')} placeholder="050-0000000"
                      style={{ ...INPUT, direction: 'ltr', textAlign: 'right' }} onFocus={focus} onBlur={blur} />
                  </label>
                </div>
                <label className="flex flex-col gap-1.5 font-semibold text-ink-nav" style={{ fontSize: 14 }}>
                  נושא הפנייה
                  <select value={form.topic} onChange={set('topic')} style={INPUT} onFocus={focus} onBlur={blur}>
                    {CONTACT_TOPICS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </label>
                <label className="flex flex-col gap-1.5 font-semibold text-ink-nav" style={{ fontSize: 14 }}>
                  בכמה מילים
                  <textarea rows={3} value={form.message} onChange={set('message')}
                    placeholder="מה מביא אתכם לפנות? (לא חובה)"
                    style={{ ...INPUT, resize: 'vertical' }} onFocus={focus} onBlur={blur} />
                </label>
                {status === 'error' && (
                  <p className="text-clay text-sm rounded-lg px-3 py-2" style={{ background: 'rgba(154,74,58,.08)' }}>
                    אירעה שגיאה, אנא נסו שוב.
                  </p>
                )}
                <button type="submit" disabled={status === 'sending'}
                  className="w-full font-bold text-paper cursor-pointer transition-all hover:-translate-y-0.5 disabled:opacity-60"
                  style={{ fontSize: 16, padding: 14, borderRadius: 12, border: 'none', background: '#3a5a40', boxShadow: '0 10px 26px rgba(58,90,64,.28)', marginTop: 4 }}>
                  {status === 'sending' ? 'שולח…' : 'שליחת הפנייה'}
                </button>
                <p className="text-center text-muted" style={{ fontSize: 12, margin: '2px 0 0' }}>
                  בלחיצה אני מאשר/ת יצירת קשר חוזר · פרטיותך נשמרת
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
