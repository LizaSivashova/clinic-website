import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const INPUT = {
  width: '100%',
  border: '1.5px solid rgba(44,40,35,.14)',
  borderRadius: 11,
  padding: '12px 14px',
  fontSize: 15,
  background: '#fff',
  color: '#2c2823',
  outline: 'none',
  direction: 'ltr',
  textAlign: 'right',
  fontFamily: 'inherit',
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    try {
      const res  = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) { setError(true); return; }
      login(data.accessToken || data.token);
      navigate('/admin');
    } catch { setError(true); }
    finally { setLoading(false); }
  };

  const focus = (e) => (e.target.style.borderColor = '#3a5a40');
  const blur  = (e) => (e.target.style.borderColor = 'rgba(44,40,35,.14)');

  return (
    <div
      dir="rtl"
      lang="he"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
        background: 'radial-gradient(120% 80% at 80% -10%, #f7f0e2 0%, #f1e9da 45%, #ece2cf 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient orbs */}
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
        <div className="orb-1" style={{ position: 'absolute', top: -140, right: -100, width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle,rgba(58,90,64,.22),transparent 66%)' }} />
        <div className="orb-2" style={{ position: 'absolute', bottom: -160, left: -120, width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle,rgba(192,130,79,.2),transparent 66%)' }} />
      </div>

      <div
        className="relative bg-paper"
        style={{ width: '100%', maxWidth: 400, border: '1px solid rgba(44,40,35,.08)', borderRadius: 24, padding: '40px 36px', boxShadow: '0 30px 80px rgba(44,40,35,.18)' }}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-7">
          <span className="flex items-center justify-center rounded-full font-display font-bold text-paper mb-3"
            style={{ width: 54, height: 54, background: '#3a5a40', fontSize: 26 }}>צ</span>
          <h2 className="font-display font-bold text-ink m-0" style={{ fontSize: 26 }}>כניסת מנהל</h2>
          <p className="text-muted mt-1 mb-0" style={{ fontSize: 14 }}>לוח הבקרה של ישראלה ישראלי</p>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 font-semibold text-ink-nav" style={{ fontSize: 14 }}>
            שם משתמש
            <input value={username} onChange={e => { setUsername(e.target.value); setError(false); }}
              placeholder="admin" style={INPUT} onFocus={focus} onBlur={blur} autoComplete="username" />
          </label>

          <label className="flex flex-col gap-1.5 font-semibold text-ink-nav" style={{ fontSize: 14 }}>
            סיסמה
            <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(false); }}
              placeholder="••••••••" style={INPUT} onFocus={focus} onBlur={blur} autoComplete="current-password" />
          </label>

          {error && (
            <p className="text-clay text-sm rounded-lg px-3 py-2" style={{ background: 'rgba(154,74,58,.08)', fontSize: 13.5 }}>
              פרטי התחברות שגויים.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="font-bold text-paper cursor-pointer transition-all hover:-translate-y-0.5 disabled:opacity-60"
            style={{ fontSize: 16, padding: 14, borderRadius: 12, border: 'none', background: '#3a5a40', marginTop: 6 }}
          >
            {loading ? 'מתחבר…' : 'התחברות'}
          </button>
        </form>

        <div className="text-center mt-4">
          <button onClick={() => navigate('/')}
            className="text-muted hover:text-forest transition-colors cursor-pointer"
            style={{ fontSize: 13.5, background: 'none', border: 'none' }}>
            ← חזרה לאתר
          </button>
        </div>
      </div>
    </div>
  );
}
