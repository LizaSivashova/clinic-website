export default function AnxiousToCalm() {
  return (
    <section id="zt-journey" className="relative z-10 overflow-hidden" style={{ height: '100vh' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(100% 80% at 50% 56%, rgba(58,90,64,.14), rgba(58,90,64,0) 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute', top: '5vh', left: 0, right: 0,
        textAlign: 'center', zIndex: 3, pointerEvents: 'none', padding: '0 16px',
      }}>
        <p className="font-mono uppercase text-terracotta-deep mb-2"
          style={{ fontSize: 11, letterSpacing: '.18em' }}>
          — המסע הרגשי
        </p>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <h2
            className="font-display font-medium text-forest m-0"
            style={{ fontSize: 'clamp(26px,7vw,44px)', lineHeight: 1.12 }}
          >
            אל שקט פנימי…
          </h2>
        </div>
      </div>

      <div style={{ position: 'absolute', top: '13vh', left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
        <img
          src="/calm.png"
          alt="אישה רגועה נושמת עמוק"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 55%',
          }}
        />
      </div>
    </section>
  );
}
