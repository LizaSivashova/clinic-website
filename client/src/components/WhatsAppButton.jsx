const WA_URL = 'https://wa.me/972501234567';

export default function WhatsAppButton() {
  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="שלחו הודעת וואטסאפ"
      className="wa-pulse fixed z-40 flex items-center justify-center rounded-full transition-transform hover:scale-110"
      style={{
        bottom: 26, left: 26,
        width: 60, height: 60,
        background: '#25d366',
        boxShadow: '0 12px 30px rgba(37,211,102,.4)',
      }}
    >
      <svg viewBox="0 0 32 32" width="32" height="32" fill="#fff">
        <path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.1 1.6 5.9L4 29l8.3-1.6C14 28.4 15 28.6 16 28.6c6.6 0 12-5.4 12-12S22.6 3 16 3zm0 22c-1 0-2-.2-2.9-.5l-.4-.1-3.5.7.7-3.4-.2-.4A9.4 9.4 0 0 1 6.6 15c0-5.2 4.2-9.4 9.4-9.4s9.4 4.2 9.4 9.4-4.2 9.4-9.4 9.4zm5.2-7c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.6.1l-.9 1c-.2.2-.3.2-.6.1a7.7 7.7 0 0 1-3.8-3.3c-.3-.5.3-.5.8-1.5.1-.2 0-.3 0-.5l-.9-2c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.8.8-1 1.8-1 3 .1 1.7 1.3 3.4 1.5 3.6.2.2 2.6 4 6.3 5.4 2.3.9 2.9.7 3.5.6.7-.1 1.7-.7 2-1.4.2-.6.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z" />
      </svg>
    </a>
  );
}
