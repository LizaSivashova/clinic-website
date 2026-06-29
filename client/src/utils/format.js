// SQLite stores UTC timestamps without a zone marker; append 'Z' so the
// browser parses them as UTC and renders them in Israel local time.
export function formatDate(raw, withTime = false) {
  if (!raw) return '';
  const d = new Date(raw.replace(' ', 'T') + 'Z');
  const opts = withTime
    ? { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { day: '2-digit', month: '2-digit', year: 'numeric' };
  return d.toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem', ...opts });
}
