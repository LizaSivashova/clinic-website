import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function Settings() {
  const { apiFetch } = useAuth();
  const [email, setEmail] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [emailMsg, setEmailMsg] = useState(null);

  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwMsg, setPwMsg] = useState(null);
  const [pwHash, setPwHash] = useState('');

  useEffect(() => {
    apiFetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setEmail(d.settings.notification_email);
          setEnabled(d.settings.email_notifications_enabled);
        }
      })
      .catch(() => {});
  }, [apiFetch]);

  const saveEmail = async (e) => {
    e.preventDefault();
    setEmailMsg(null);
    const res = await apiFetch('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify({
        notification_email: email,
        email_notifications_enabled: enabled,
      }),
    });
    const d = await res.json();
    setEmailMsg(d.ok ? { ok: true, text: 'ההגדרות נשמרו' } : { ok: false, text: d.error || 'שגיאה' });
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwMsg(null);
    setPwHash('');
    const res = await apiFetch('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify({ current_password: curPw, new_password: newPw }),
    });
    const d = await res.json();
    if (d.ok && d.newPasswordHash) {
      setPwHash(d.newPasswordHash);
      setPwMsg({ ok: true, text: 'הסיסמה עודכנה — עדכנו את קובץ ה-.env בהמשך' });
      setCurPw('');
      setNewPw('');
    } else {
      setPwMsg({ ok: false, text: d.error || 'שגיאה בעדכון הסיסמה' });
    }
  };

  const field =
    'w-full rounded-xl border border-cream-dark bg-white px-4 py-2.5 text-bark outline-none focus:border-clay focus:ring-2 focus:ring-clay/30';
  const card =
    'rounded-2xl border border-cream-dark bg-white/80 p-6 shadow-soft';
  const msgCls = (m) =>
    `rounded-xl px-4 py-2.5 text-sm ${m.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Notification email + toggle */}
      <form onSubmit={saveEmail} className={card}>
        <h3 className="mb-4 text-lg font-bold text-bark">התראות במייל</h3>

        <label className="mb-1 block text-sm font-medium text-bark">כתובת אימייל לקבלת התראות</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} placeholder="demo@example.com" />

        <label className="mt-5 flex cursor-pointer items-center justify-between rounded-xl bg-cream-dark/40 px-4 py-3">
          <span className="font-medium text-bark">קבלת התראות במייל</span>
          <span className="relative inline-flex">
            <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="peer sr-only" />
            <span className="h-6 w-11 rounded-full bg-bark/25 transition-colors peer-checked:bg-clay" />
            <span className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:-translate-x-5" />
          </span>
        </label>

        {emailMsg && <p className={`mt-4 ${msgCls(emailMsg)}`}>{emailMsg.text}</p>}

        <button className="mt-5 w-full rounded-full bg-clay py-3 font-semibold text-white transition-colors hover:bg-clay-dark">
          שמירת הגדרות
        </button>
      </form>

      {/* Change password */}
      <form onSubmit={changePassword} className={card}>
        <h3 className="mb-4 text-lg font-bold text-bark">שינוי סיסמה</h3>

        <label className="mb-1 block text-sm font-medium text-bark">סיסמה נוכחית</label>
        <input type="password" value={curPw} onChange={(e) => setCurPw(e.target.value)} className={field} autoComplete="current-password" />

        <label className="mb-1 mt-4 block text-sm font-medium text-bark">סיסמה חדשה</label>
        <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} className={field} autoComplete="new-password" />

        {pwMsg && <p className={`mt-4 ${msgCls(pwMsg)}`}>{pwMsg.text}</p>}

        {pwHash && (
          <div className="mt-3 rounded-xl bg-cream-dark/50 p-3">
            <p className="mb-1 text-xs text-bark/60">העתיקו שורה זו לקובץ <code>.env</code> והפעילו מחדש את השרת:</p>
            <code className="block select-all break-all text-xs text-bark">ADMIN_PASSWORD_HASH={pwHash}</code>
          </div>
        )}

        <button className="mt-5 w-full rounded-full bg-bark py-3 font-semibold text-cream transition-colors hover:bg-bark-soft">
          עדכון סיסמה
        </button>
      </form>
    </div>
  );
}
