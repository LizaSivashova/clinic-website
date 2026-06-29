import { useMemo, useState } from 'react';
import { formatDate } from '../../utils/format';

const COLS = [
  { key: 'created_at', label: 'תאריך' },
  { key: 'name',       label: 'שם' },
  { key: 'phone',      label: 'טלפון' },
  { key: 'topic',      label: 'נושא' },
  { key: 'message',    label: 'הודעה' },
];

function toCsv(rows) {
  const header = ['תאריך', 'שם', 'טלפון', 'נושא', 'הודעה'];
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = rows.map((r) =>
    [formatDate(r.created_at, true), r.name, r.phone, r.topic, r.message].map(esc).join(',')
  );
  return '﻿' + [header.join(','), ...lines].join('\n');
}

const INPUT = {
  padding: '9px 14px', borderRadius: 10, fontSize: 14,
  border: '1.5px solid rgba(44,40,35,.14)', background: '#fff', color: '#2c2823', outline: 'none',
  fontFamily: 'inherit', width: '100%',
};

export default function SubmissionsTable({ submissions }) {
  const [query, setQuery]   = useState('');
  const [sort, setSort]     = useState({ key: 'created_at', dir: 'desc' });
  const [selected, setSelected] = useState(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = submissions.filter((s) =>
      !q ? true : [s.name, s.phone, s.topic, s.message].join(' ').toLowerCase().includes(q)
    );
    return [...list].sort((a, b) => {
      const cmp = String(a[sort.key] ?? '').localeCompare(String(b[sort.key] ?? ''), 'he', { numeric: true });
      return sort.dir === 'asc' ? cmp : -cmp;
    });
  }, [submissions, query, sort]);

  const toggleSort = (key) => setSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' });

  const downloadCsv = () => {
    const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: url, download: `submissions-${new Date().toISOString().slice(0, 10)}.csv` });
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="חיפוש בפניות…"
          style={{ ...INPUT, maxWidth: 320 }}
          onFocus={e => (e.target.style.borderColor = '#3a5a40')}
          onBlur={e => (e.target.style.borderColor = 'rgba(44,40,35,.14)')} />
        <button onClick={downloadCsv}
          style={{ padding: '9px 18px', borderRadius: 10, border: 'none', background: '#2c2823', color: '#fbf7ef', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          ייצוא CSV
        </button>
        <span style={{ marginRight: 'auto', fontSize: 13, color: '#8a7a64' }}>{rows.length} פניות</span>
      </div>

      {/* Table */}
      <div style={{ background: '#fbf7ef', border: '1px solid rgba(44,40,35,.08)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 4px 16px rgba(44,40,35,.06)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'right', fontSize: 14, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(44,40,35,.04)', borderBottom: '1px solid rgba(44,40,35,.08)' }}>
                {COLS.map(c => (
                  <th key={c.key} onClick={() => toggleSort(c.key)}
                    style={{ padding: '12px 16px', fontWeight: 600, color: '#5b5347', cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none' }}>
                    {c.label}{sort.key === c.key && (sort.dir === 'asc' ? ' ▲' : ' ▼')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((s, i) => (
                <tr key={s.id} onClick={() => setSelected(s)}
                  style={{ borderBottom: i < rows.length - 1 ? '1px solid rgba(44,40,35,.06)' : 'none', cursor: 'pointer', transition: 'background .12s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(44,40,35,.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '12px 16px', color: '#8a7a64', whiteSpace: 'nowrap' }}>{formatDate(s.created_at, true)}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#2c2823', whiteSpace: 'nowrap' }}>{s.name}</td>
                  <td style={{ padding: '12px 16px', color: '#8a7a64', direction: 'ltr', textAlign: 'right' }}>{s.phone}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ display: 'inline-block', padding: '3px 11px', borderRadius: 999, background: 'rgba(192,130,79,.14)', color: '#a86a3a', fontSize: 12 }}>{s.topic}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#8a7a64', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.message}</td>
                </tr>
              ))}
              {!rows.length && (
                <tr><td colSpan={COLS.length} style={{ padding: '40px', textAlign: 'center', color: '#b3a994' }}>לא נמצאו פניות</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
          <div onClick={() => setSelected(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(44,40,35,.45)' }} />
          <aside style={{
            position: 'absolute', inset: '0 auto 0 0', width: '100%', maxWidth: 420,
            background: '#fbf7ef', padding: '28px', overflowY: 'auto',
            boxShadow: '4px 0 40px rgba(44,40,35,.2)', display: 'flex', flexDirection: 'column', gap: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 className="font-display font-bold text-ink m-0" style={{ fontSize: 24 }}>{selected.name}</h3>
                <p style={{ fontSize: 13, color: '#8a7a64', margin: '4px 0 0' }}>{formatDate(selected.created_at, true)}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#8a7a64', padding: 4 }}>✕</button>
            </div>
            {[
              { label: 'טלפון', content: <a href={`tel:${selected.phone}`} style={{ color: '#c0824f' }}>{selected.phone}</a> },
              { label: 'נושא',  content: selected.topic },
              { label: 'הודעה', content: <p style={{ whiteSpace: 'pre-wrap', margin: 0, lineHeight: 1.6, color: '#5b5347' }}>{selected.message || '—'}</p> },
            ].map(row => (
              <div key={row.label} style={{ background: '#fff', border: '1px solid rgba(44,40,35,.08)', borderRadius: 12, padding: '12px 16px' }}>
                <div style={{ fontSize: 12, color: '#8a7a64', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 5 }}>{row.label}</div>
                <div style={{ fontSize: 15, color: '#2c2823' }}>{row.content}</div>
              </div>
            ))}
            <a href={`tel:${selected.phone}`}
              style={{ display: 'block', textAlign: 'center', padding: '13px', borderRadius: 12, background: '#3a5a40', color: '#fbf7ef', fontSize: 16, fontWeight: 700, textDecoration: 'none', marginTop: 8 }}>
              חיוג ישיר
            </a>
          </aside>
        </div>
      )}
    </div>
  );
}
