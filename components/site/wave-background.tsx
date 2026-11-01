export function WaveBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-linear-to-br from-navy via-royal to-aqua" />
      <svg
        className="absolute -bottom-8 left-0 h-[55%] w-[140%] min-w-[720px] text-aqua/40"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          className="wave-path origin-center"
          fill="currentColor"
          d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L0,320Z"
        />
      </svg>
      <svg
        className="absolute -bottom-4 left-0 h-[42%] w-[140%] min-w-[720px] text-white/20"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          className="wave-path-slow origin-center"
          fill="currentColor"
          d="M0,256L40,240C80,224,160,192,240,186.7C320,181,400,203,480,224C560,245,640,267,720,245.3C800,224,880,160,960,144C1040,128,1120,160,1200,176C1280,192,1360,192,1400,192L1440,192L1440,320L0,320Z"
        />
      </svg>
      <div className="absolute top-10 right-10 size-24 rounded-full bg-gold/20 blur-2xl" />
      <div className="absolute top-1/3 left-8 size-16 rounded-full bg-aqua/30 blur-xl" />
    </div>
  );
}
