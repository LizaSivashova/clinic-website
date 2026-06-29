export default function StatCard({ label, value, accent = 'clay' }) {
  const ring = {
    clay: 'bg-clay/12 text-clay',
    bark: 'bg-bark/12 text-bark',
    green: 'bg-green-100 text-green-600',
  }[accent];

  return (
    <div className="rounded-2xl border border-cream-dark bg-white/80 p-5 shadow-soft">
      <p className="text-sm text-bark/60">{label}</p>
      <p className="mt-2 text-3xl font-bold text-bark">{value}</p>
      <span className={`mt-3 inline-block rounded-full px-3 py-0.5 text-xs ${ring}`}>
        עדכני
      </span>
    </div>
  );
}
