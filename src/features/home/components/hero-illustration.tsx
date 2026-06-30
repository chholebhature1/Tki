"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

interface TherapistCard {
  id: number;
  name: string;
  title: string;
  specializations: string[];
  gradient: string;
  image: string;
  slug: string;
}

const therapists: TherapistCard[] = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    title: "Clinical Psychologist",
    specializations: ["Anxiety", "Depression", "Stress"],
    gradient: "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 50%, #80deea 100%)",
    image: "/images/therapists/priya-sharma.jpg",
    slug: "dr-priya-sharma",
  },
  {
    id: 2,
    name: "Dr. Arjun Mehta",
    title: "Psychiatrist",
    specializations: ["Relationships", "Family", "Career"],
    gradient: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)",
    image: "/images/therapists/arjun-mehta.jpg",
    slug: "dr-arjun-mehta",
  },
  {
    id: 3,
    name: "Dr. Kavitha Nair",
    title: "Child & Adolescent Psychologist",
    specializations: ["Child & Teen", "ADHD", "Anxiety"],
    gradient: "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 50%, #f48fb1 100%)",
    image: "/images/therapists/kavitha-nair.jpg",
    slug: "dr-kavitha-nair",
  },
  {
    id: 4,
    name: "Dr. Rohit Kapoor",
    title: "Addiction Counselor",
    specializations: ["Addiction", "Stress", "Trauma"],
    gradient: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 50%, #ffcc80 100%)",
    image: "/images/therapists/rohit-kapoor.jpg",
    slug: "dr-rohit-kapoor",
  },
  {
    id: 5,
    name: "Dr. Meera Reddy",
    title: "Counseling Psychologist",
    specializations: ["Self-Esteem", "Grief", "Mindfulness"],
    gradient: "linear-gradient(135deg, #ede7f6 0%, #d1c4e9 50%, #b39ddb 100%)",
    image: "/images/therapists/meera-reddy.jpg",
    slug: "dr-meera-reddy",
  },
];

export function HeroIllustration() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % therapists.length);
  }, []);

  const prev = useCallback(() => {
    setActive((i) => (i - 1 + therapists.length) % therapists.length);
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(next, 3500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, next]);

  function getCardStyle(index: number): React.CSSProperties {
    const count = therapists.length;
    let offset = index - active;
    if (offset > count / 2) offset -= count;
    if (offset < -count / 2) offset += count;

    const absOffset = Math.abs(offset);
    const translateX = offset * 68;
    const translateZ = -absOffset * 110;
    const rotateY = offset * -14;
    const scale = 1 - absOffset * 0.1;
    const opacity = absOffset > 2 ? 0 : 1 - absOffset * 0.3;
    const zIndex = 10 - absOffset;

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
      pointerEvents: absOffset === 0 ? "auto" : "none",
    };
  }

  return (
    <div
      className="relative h-[460px] w-full lg:h-[520px]"
      aria-label="Featured therapists carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* 3D Stage */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "1000px" }}>
        {therapists.map((therapist, index) => (
          <div
            key={therapist.id}
            className="absolute transition-all duration-500 ease-out"
            style={getCardStyle(index)}
          >
            {/* Card — 4:5 aspect ratio */}
            <div className="w-[220px] overflow-hidden rounded-2xl border border-border bg-white shadow-lg sm:w-[240px]" style={{ aspectRatio: "4/5" }}>
              {/* Image area — takes ~65% of card height */}
              <div
                className="relative h-[65%] overflow-hidden"
                style={{ background: therapist.gradient }}
              >
                {!failedImages[therapist.id] ? (
                  <img
                    src={therapist.image}
                    alt={therapist.name}
                    className="h-full w-full object-cover object-top transition-transform duration-500"
                    style={{ transform: index === active ? "scale(1.03)" : "scale(1)" }}
                    loading="lazy"
                    onError={() => setFailedImages((p) => ({ ...p, [therapist.id]: true }))}
                  />
                ) : (
                  /* Fallback placeholder — abstract wellness shape */
                  <div className="flex h-full w-full items-center justify-center">
                    <svg viewBox="0 0 120 150" className="h-3/4 w-3/4 opacity-30" fill="none">
                      <ellipse cx="60" cy="55" rx="28" ry="30" fill="currentColor" className="text-text" />
                      <path d="M60 85 C35 95, 25 120, 35 145 L85 145 C95 120, 85 95, 60 85Z" fill="currentColor" className="text-text" opacity="0.7" />
                      <circle cx="42" cy="30" r="4" fill="currentColor" className="text-primary" opacity="0.5" />
                      <circle cx="78" cy="30" r="4" fill="currentColor" className="text-primary" opacity="0.5" />
                    </svg>
                  </div>
                )}
                {/* Subtle overlay for text readability */}
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white/60 to-transparent" />
              </div>

              {/* Body — 35% */}
              <div className="flex h-[35%] flex-col justify-between p-3.5">
                <div>
                  <p className="text-[13px] font-bold leading-tight text-text">{therapist.name}</p>
                  <p className="mt-0.5 text-[10px] leading-tight text-text-secondary">{therapist.title}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {therapist.specializations.map((s) => (
                      <span key={s} className="rounded-full bg-primary-light px-2 py-0.5 text-[9px] font-medium text-primary">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {index === active && (
                  <Link
                    href={`/therapists/${therapist.slug}`}
                    className="mt-2 block rounded-lg bg-primary py-1.5 text-center text-[11px] font-medium text-white hover:bg-primary-hover"
                  >
                    View Profile →
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 gap-2">
        {therapists.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === active ? "w-6 bg-primary" : "w-2 bg-border hover:bg-muted"
            }`}
            aria-label={`Show therapist ${i + 1}`}
          />
        ))}
      </div>

      {/* Prev/Next */}
      <button
        type="button"
        onClick={prev}
        className="absolute left-0 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white/90 text-text-secondary shadow-sm transition-colors hover:border-primary hover:text-primary"
        aria-label="Previous therapist"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-0 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white/90 text-text-secondary shadow-sm transition-colors hover:border-primary hover:text-primary"
        aria-label="Next therapist"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Floating badge */}
      <div className="absolute right-1 top-3 z-20 rounded-lg border border-border bg-white/95 px-2.5 py-1.5 shadow-sm backdrop-blur-sm sm:right-3 sm:top-5">
        <p className="text-[9px] text-text-secondary">Verified Therapists</p>
        <p className="text-xs font-bold text-text">120+ Online</p>
      </div>
    </div>
  );
}
