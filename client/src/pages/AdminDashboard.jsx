import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Overview from '../components/dashboard/Overview';
import SubmissionsTable from '../components/dashboard/SubmissionsTable';
import Settings from '../components/dashboard/Settings';

const TABS = [
  { id: 'overview',    label: 'סקירה',  icon: '⬛' },
  { id: 'submissions', label: 'פניות',  icon: '✉' },
  { id: 'settings',    label: 'הגדרות', icon: '⚙' },
];

export default function AdminDashboard() {
  const { apiFetch, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab]               = useState('overview');
  const [stats, setStats]           = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [sRes, subRes] = await Promise.all([apiFetch('/api/admin/stats'), apiFetch('/api/admin/submissions')]);
        const sData = await sRes.json();
        const subData = await subRes.json();
        if (!active) return;
        if (sData.ok) setStats(sData.stats);
        if (subData.ok) setSubmissions(subData.submissions);
      } catch (e) {
        if (active && e.message !== 'unauthorized') setError('שגיאה בטעינת הנתונים');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [apiFetch]);

  const SidebarContent = ({ onNav }) => (
    <>
      <div style={{ padding: '0 22px 24px', borderBottom: '1px solid rgba(216,207,190,.1)', marginBottom: 14 }}>
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center rounded-full font-display font-bold flex-shrink-0"
            style={{ width: 40, height: 40, background: '#c0824f', color: '#2c2823', fontSize: 21 }}>צ</span>
          <div>
            <div className="font-display font-bold" style={{ fontSize: 16, color: '#fbf7ef' }}>ישראלה ישראלי</div>
            <div className="font-mono" style={{ fontSize: 10.5, color: '#8a7a64', letterSpacing: '.12em' }}>admin panel</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); onNav?.(); }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 15, textAlign: 'right', transition: 'background .15s', background: tab === t.id ? 'rgba(192,130,79,.18)' : 'transparent', color: tab === t.id ? '#e6b07a' : '#b3a994', fontWeight: tab === t.id ? '600' : '400', fontFamily: 'inherit' }}>
            <span style={{ fontSize: 15 }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: '16px 12px 0', borderTop: '1px solid rgba(216,207,190,.1)' }}>
        <button onClick={() => navigate('/')} style={{ display: 'block', width: '100%', textAlign: 'right', padding: '9px 14px', background: 'none', border: 'none', color: '#8a7a64', fontSize: 13.5, cursor: 'pointer', borderRadius: 8, fontFamily: 'inherit' }}>← חזרה לאתר</button>
        <button onClick={logout} style={{ display: 'block', width: '100%', textAlign: 'right', padding: '9px 14px', background: 'none', border: 'none', color: '#9a4a3a', fontSize: 13.5, cursor: 'pointer', fontWeight: '600', borderRadius: 8, fontFamily: 'inherit' }}>התנתקות</button>
      </div>
    </>
  );

  return (
    <div dir="rtl" lang="he" style={{ minHeight: '100vh', background: '#f6efe1', fontFamily: '"IBM Plex Sans Hebrew", sans-serif' }}>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 240, background: '#2c2823', zIndex: 30, borderLeft: '1px solid rgba(216,207,190,.1)', paddingTop: 28 }}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-40" style={{ background: 'rgba(44,40,35,.5)' }} onClick={() => setSidebarOpen(false)} />
          <aside className="lg:hidden fixed top-0 right-0 bottom-0 z-50 flex flex-col" style={{ width: 260, background: '#2c2823', paddingTop: 28 }}>
            <SidebarContent onNav={() => setSidebarOpen(false)} />
          </aside>
        </>
      )}

      {/* Main */}
      <div className="lg:mr-60" style={{ minHeight: '100vh' }}>
        {/* Top bar */}
        <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(251,247,239,.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(44,40,35,.08)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button className="lg:hidden cursor-pointer" onClick={() => setSidebarOpen(o => !o)}
              style={{ background: 'none', border: 'none', fontSize: 20, color: '#2c2823', padding: 4 }}>☰</button>
            <h1 className="font-display font-bold text-ink m-0" style={{ fontSize: 20 }}>
              {TABS.find(t => t.id === tab)?.label}
            </h1>
          </div>
          <span className="font-mono text-muted hidden sm:block" style={{ fontSize: 12 }}>
            {new Date().toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </header>

        <main style={{ padding: 'clamp(16px,3vw,30px) clamp(16px,4vw,32px)' }}>
          {loading ? (
            <div style={{ display: 'grid', placeItems: 'center', padding: '80px 0' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', border: '4px solid rgba(192,130,79,.25)', borderTopColor: '#c0824f', animation: 'spin 1s linear infinite' }} />
              <p className="text-ink-soft mt-4">טוען נתונים…</p>
            </div>
          ) : error ? (
            <p style={{ background: 'rgba(154,74,58,.08)', color: '#9a4a3a', padding: '12px 16px', borderRadius: 12 }}>{error}</p>
          ) : (
            <>
              {tab === 'overview'    && <Overview stats={stats} submissions={submissions} />}
              {tab === 'submissions' && <SubmissionsTable submissions={submissions} />}
              {tab === 'settings'    && <Settings />}
            </>
          )}
        </main>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } .lg\\:mr-60 { margin-right: 0; } @media (min-width: 1024px) { .lg\\:mr-60 { margin-right: 240px; } }`}</style>
    </div>
  );
}
