// A single specialty card. `delay` staggers the reveal animation; the card
// becomes visible when its parent grid sets `visible`.
export default function SpecialtyCard({ icon, label, subtitle, visible, delay }) {
  return (
    <div
      className={`reveal group rounded-2xl border border-cream-dark bg-white/60 p-6 text-center shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-clay/40 hover:shadow-lift ${
        visible ? 'is-visible' : ''
      }`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-clay/12 text-clay transition-colors group-hover:bg-clay group-hover:text-white">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-bark">{label}</h3>
      <p className="mt-1 text-sm text-bark/55">{subtitle}</p>
    </div>
  );
}
