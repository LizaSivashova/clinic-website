// Fixed ambient gradient orbs behind all landing content. Decorative only.
export default function AmbientOrbs() {
  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="orb-1 absolute top-[-160px] right-[-120px] w-[520px] h-[520px] rounded-full"
        style={{ background: 'radial-gradient(circle at 35% 35%, rgba(192,130,79,.32), rgba(192,130,79,0) 68%)', filter: 'blur(8px)' }} />
      <div className="orb-2 absolute bottom-[-180px] left-[-140px] w-[600px] h-[600px] rounded-full"
        style={{ background: 'radial-gradient(circle at 60% 40%, rgba(58,90,64,.26), rgba(58,90,64,0) 66%)', filter: 'blur(10px)' }} />
      <div className="orb-3 absolute top-[38%] left-[42%] w-[360px] h-[360px] rounded-full"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(168,106,58,.14), rgba(168,106,58,0) 70%)', filter: 'blur(6px)' }} />
    </div>
  );
}
