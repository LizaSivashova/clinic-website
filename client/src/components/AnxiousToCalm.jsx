import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AnxiousToCalm() {
  const wrapRef    = useRef(null);
  const stageRef   = useRef(null);
  const anxImgRef  = useRef(null);
  const calmImgRef = useRef(null);
  const anxH2Ref   = useRef(null);
  const calmH2Ref  = useRef(null);
  const washRef    = useRef(null);
  const barRef     = useRef(null);
  const labelRef   = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Master scrub timeline — pinned to the 275vh wrapper
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,          // lag coefficient → buttery tracking
          pin: stageRef.current,
          pinSpacing: false,
          anticipatePin: 1,
        },
      });

      // ── Anxious heading: fade + drift up ─────────────────────────────────
      tl.to(anxH2Ref.current, {
        opacity: 0, y: -30, duration: 0.30,
      }, 0.05);

      // ── Anxious image: fade out + drift left + blur ───────────────────────
      tl.to(anxImgRef.current, {
        opacity: 0, xPercent: -12, filter: 'blur(8px)',
        duration: 0.45, ease: 'power2.in',
      }, 0.05);

      // ── Radial wash: fade in ──────────────────────────────────────────────
      tl.to(washRef.current, { opacity: 1, duration: 0.30 }, 0.22);

      // ── Calm image: arrive from right + un-blur ───────────────────────────
      tl.fromTo(calmImgRef.current,
        { opacity: 0, xPercent: 14, filter: 'blur(9px)' },
        { opacity: 1, xPercent:  0, filter: 'blur(0px)', duration: 0.50, ease: 'power2.out' },
        0.50
      );

      // ── Calm heading: rise up into view ──────────────────────────────────
      tl.fromTo(calmH2Ref.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y:  0, duration: 0.35, ease: 'power2.out' },
        0.62
      );

      // ── Progress bar: scaleX 0 → 1 across whole scroll ───────────────────
      tl.fromTo(barRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: 'none' },
        0
      );

      // ── Label: fade in at start ───────────────────────────────────────────
      tl.fromTo(labelRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.20 },
        0.02
      );
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    // 275vh wrapper: gives ScrollTrigger the scroll distance to scrub through
    <section
      id="zt-journey"
      ref={wrapRef}
      className="relative z-10"
      style={{ height: '275vh' }}
    >
      {/* Sticky stage — GSAP pins this to the viewport top */}
      <div
        ref={stageRef}
        style={{
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Forest radial wash (initially invisible, GSAP fades in) */}
        <div
          ref={washRef}
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0,
            background: 'radial-gradient(100% 80% at 50% 56%, rgba(58,90,64,.14), rgba(58,90,64,0) 70%)',
          }}
        />

        {/* Headings */}
        <div style={{
          position: 'absolute', top: '5vh', left: 0, right: 0,
          textAlign: 'center', zIndex: 3, pointerEvents: 'none', padding: '0 16px',
        }}>
          <p className="font-mono uppercase text-terracotta-deep mb-2"
            style={{ fontSize: 11, letterSpacing: '.18em' }}>
            — המסע הרגשי
          </p>
          <div style={{ position: 'relative', height: 48, maxWidth: 760, margin: '0 auto' }}>
            <h2
              ref={anxH2Ref}
              className="font-display font-medium text-clay absolute inset-x-0 top-0 m-0"
              style={{ fontSize: 'clamp(26px,7vw,44px)', lineHeight: 1.12, whiteSpace: 'nowrap' }}
            >
              מהמולת המחשבות…
            </h2>
            <h2
              ref={calmH2Ref}
              className="font-display font-medium text-forest absolute inset-x-0 top-0 m-0"
              style={{ fontSize: 'clamp(26px,7vw,44px)', lineHeight: 1.12, whiteSpace: 'nowrap', opacity: 0 }}
            >
              אל שקט פנימי…
            </h2>
          </div>
        </div>

        {/* Illustration pair */}
        <div style={{
          position: 'absolute',
          top: '13vh',
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
        }}>
          <img
            ref={anxImgRef}
            src="/anxious.png"
            alt="אישה שקועה במחשבות מטרידות"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center 55%',
              willChange: 'transform, opacity, filter',
            }}
          />
          <img
            ref={calmImgRef}
            src="/calm.png"
            alt="אישה רגועה נושמת עמוק"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center 55%',
              opacity: 0,
              willChange: 'transform, opacity, filter',
            }}
          />
        </div>

        {/* Scroll progress indicator */}
        <div style={{
          position: 'absolute', bottom: '5vh', left: 0, right: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 11, zIndex: 3, pointerEvents: 'none',
        }}>
          <div style={{
            width: 220, height: 3, borderRadius: 3,
            background: 'rgba(44,40,35,.12)', overflow: 'hidden',
          }}>
            <div
              ref={barRef}
              style={{
                height: '100%', borderRadius: 3,
                background: 'linear-gradient(270deg, #3a5a40, #9a4a3a)',
                transformOrigin: 'right center',
                transform: 'scaleX(0)',
              }}
            />
          </div>
          <p
            ref={labelRef}
            className="font-mono uppercase text-muted"
            style={{ fontSize: 10.5, letterSpacing: '.2em', opacity: 0 }}
          >
              גללו אל הרוגע
          </p>
        </div>
      </div>
    </section>
  );
}
