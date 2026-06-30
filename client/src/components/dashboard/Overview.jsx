import { formatDate } from '../../utils/format';

function StatCard({ label, value, sub, accent }) {
  const colors = {
    forest: { bg: 'rgba(58,90,64,.1)', color: '#3a5a40', border: 'rgba(58,90,64,.15)' },
    terra:  { bg: 'rgba(192,130,79,.12)', color: '#a86a3a', border: 'rgba(192,130,79,.2)' },
    ink:    { bg: 'rgba(44,40,35,.06)', color: '#2c2823', border: 'rgba(44,40,35,.08)' },
  };
  const c = colors[accent] || colors.ink;
  return (
    <div style={{ background: '#fbf7ef', border: `1px solid ${c.border}`, borderRadius: 18, padding: 'clamp(14px,3.5vw,22px) clamp(14px,3.5vw,24px)', boxShadow: '0 4px 16px rgba(44,40,35,.06)' }}>
      <div style={{ fontSize: 'clamp(12px,3vw,13px)', color: '#8a7a64', marginBottom: 8 }}>{label}</div>
      <div className="font-display font-bold" style={{ fontSize: 'clamp(24px,6.5vw,38px)', color: c.color, lineHeight: 1.1, wordBreak: 'break-word' }}>{value ?? '—'}</div>
      {sub && <div style={{ fontSize: 13, color: '#b3a994', marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

export default function Overview({ stats, submissions }) {
  if (!stats) return null;

  const recent = (submissions || []).slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: 'clamp(10px,2.5vw,16px)' }}>
        <StatCard label='סה"כ פניות'      value={stats.total}     accent="ink"    />
        <StatCard label="פניות החודש"     value={stats.thisMonth}  accent="terra"  />
        <StatCard label="פניות השבוע"     value={stats.thisWeek}   accent="forest" />
        <StatCard label="הנושא הנפוץ"     value={stats.topTopic}   accent="terra"  />
      </div>

      {/* Topic breakdown */}
      {stats.topicCounts && Object.keys(stats.topicCounts).length > 0 && (
        <div style={{ background: '#fbf7ef', border: '1px solid rgba(44,40,35,.08)', borderRadius: 18, padding: '22px 24px', boxShadow: '0 4px 16px rgba(44,40,35,.06)' }}>
          <h3 className="font-display font-bold text-ink mb-5" style={{ fontSize: 18, margin: '0 0 16px' }}>פילוח לפי נושא</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(stats.topicCounts)
              .sort(([,a],[,b]) => b - a)
              .map(([topic, count]) => {
                const max = Math.max(...Object.values(stats.topicCounts));
                const pct = Math.round(count / max * 100);
                return (
                  <div key={topic}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 14, color: '#5b5347' }}>{topic}</span>
                      <span className="font-mono" style={{ fontSize: 13, color: '#8a7a64' }}>{count}</span>
                    </div>
                    <div style={{ height: 7, borderRadius: 99, background: 'rgba(44,40,35,.1)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, borderRadius: 99, background: 'linear-gradient(90deg, #c0824f, #a86a3a)' }} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Recent submissions */}
      <div style={{ background: '#fbf7ef', border: '1px solid rgba(44,40,35,.08)', borderRadius: 18, padding: '22px 24px', boxShadow: '0 4px 16px rgba(44,40,35,.06)' }}>
        <h3 className="font-display font-bold text-ink" style={{ fontSize: 18, margin: '0 0 16px' }}>פניות אחרונות</h3>
        {recent.length ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {recent.map((s, i) => (
              <div key={s.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                padding: '13px 0',
                borderBottom: i < recent.length - 1 ? '1px solid rgba(44,40,35,.07)' : 'none',
              }}>
                <div style={{ minWidth: 0 }}>
                  <div className="font-semibold text-ink" style={{ fontSize: 15 }}>{s.name}</div>
                  <div style={{ fontSize: 13, color: '#8a7a64', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 320 }}>{s.message || '—'}</div>
                </div>
                <div style={{ flexShrink: 0, textAlign: 'left' }}>
                  <span style={{ display: 'inline-block', padding: '3px 11px', borderRadius: 999, background: 'rgba(192,130,79,.14)', color: '#a86a3a', fontSize: 12 }}>{s.topic}</span>
                  <div style={{ fontSize: 12, color: '#b3a994', marginTop: 3 }}>{formatDate(s.created_at)}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#b3a994', textAlign: 'center', padding: '24px 0', margin: 0 }}>אין פניות עדיין</p>
        )}
      </div>
    </div>
  );
}
