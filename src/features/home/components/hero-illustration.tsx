/**
 * Abstract mental wellness illustration using SVG shapes.
 * Uses currentColor for theme consistency.
 */
export function HeroIllustration() {
  return (
    <div className="relative h-[400px] w-full text-primary lg:h-[500px]" aria-hidden="true">
      {/* Background soft circle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-80 w-80 rounded-full bg-primary-light opacity-60 lg:h-96 lg:w-96" />
      </div>

      {/* Central abstract figure */}
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        {/* Decorative rings */}
        <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="1" opacity="0.25" />
        <circle cx="200" cy="200" r="120" stroke="currentColor" strokeWidth="1" opacity="0.15" />
        <circle cx="200" cy="200" r="90" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />

        {/* Abstract head */}
        <circle cx="200" cy="150" r="35" fill="currentColor" opacity="0.15" />
        <circle cx="200" cy="150" r="25" fill="currentColor" opacity="0.3" />

        {/* Abstract body */}
        <path
          d="M200 190 C170 210, 160 250, 200 280 C240 250, 230 210, 200 190Z"
          fill="currentColor"
          opacity="0.12"
        />

        {/* Connection dots */}
        <circle cx="130" cy="180" r="6" fill="currentColor" opacity="0.4" />
        <circle cx="270" cy="180" r="6" fill="currentColor" opacity="0.4" />
        <circle cx="150" cy="260" r="4" fill="currentColor" opacity="0.3" />
        <circle cx="250" cy="260" r="4" fill="currentColor" opacity="0.3" />

        {/* Connecting lines */}
        <line x1="136" y1="180" x2="175" y2="165" stroke="currentColor" strokeWidth="1" opacity="0.2" />
        <line x1="264" y1="180" x2="225" y2="165" stroke="currentColor" strokeWidth="1" opacity="0.2" />

        {/* Growth leaves */}
        <path
          d="M200 100 C195 85, 205 75, 210 80 C215 85, 210 95, 200 100Z"
          fill="currentColor"
          opacity="0.5"
        />
        <path
          d="M200 100 C205 85, 195 75, 190 80 C185 85, 190 95, 200 100Z"
          fill="currentColor"
          opacity="0.35"
        />
      </svg>

      {/* Floating card — top right (unique data, not duplicating stats row) */}
      <div className="absolute right-4 top-8 rounded-xl border border-border bg-white px-4 py-3 shadow-sm lg:right-8 lg:top-12">
        <p className="text-xs text-text-secondary">Online Now</p>
        <p className="text-lg font-semibold text-text">120+ Therapists</p>
      </div>

      {/* Floating card — bottom left */}
      <div className="absolute bottom-12 left-4 rounded-xl border border-border bg-white px-4 py-3 shadow-sm lg:bottom-16 lg:left-8">
        <p className="text-xs text-text-secondary">Response Time</p>
        <p className="text-lg font-semibold text-text">&lt; 2 hours</p>
      </div>
    </div>
  );
}
