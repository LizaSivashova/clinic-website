import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Reveal({ delay = 0, children, className = '' }) {
  const [ref, visible] = useScrollAnimation({ threshold: 0.12 });
  return (
    <div
      ref={ref}
      className={`reveal${visible ? ' is-visible' : ''} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}
