// Six small dots rising from bottom — matches prototype's zt-rise particles.
const DOTS = [
  { left: '12%', size: 7, dur: 14, delay: 0,  color: '#c0824f', op: .5 },
  { left: '28%', size: 5, dur: 19, delay: 3,  color: '#3a5a40', op: .5 },
  { left: '48%', size: 6, dur: 16, delay: 6,  color: '#c0824f', op: .5 },
  { left: '66%', size: 8, dur: 21, delay: 2,  color: '#a86a3a', op: .4 },
  { left: '82%', size: 5, dur: 17, delay: 9,  color: '#3a5a40', op: .5 },
  { left: '90%', size: 6, dur: 23, delay: 5,  color: '#c0824f', op: .45 },
];

export default function Particles() {
  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {DOTS.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: d.left,
            top: '80%',
            width: d.size,
            height: d.size,
            background: d.color,
            opacity: d.op,
            animation: `zt-rise ${d.dur}s linear ${d.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
