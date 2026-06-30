"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

interface TherapistCard {
  id: number;
  name: string;
  title: string;
  specializations: string[];
  gradient: string;
  icon: string;
  slug: string;
}

const therapists: TherapistCard[] = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    title: "Clinical Psychologist",
    specializations: ["Anxiety", "Depression", "Stress"],
    gradient: "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 50%, #80deea 100%)",
    icon: "🧠",
    slug: "dr-priya-sharma",
  },
  {
    id: 2,
    name: "Dr. Arjun Mehta",
    title: "Psychiatrist",
    specializations: ["Relationships", "Family", "Career"],
    gradient: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)",
    icon: "💚",
    slug: "dr-arjun-mehta",
  },
  {
    id: 3,
    name: "Dr. Kavitha Nair",
    title: "Child & Adolescent Psychologist",
    specializations: ["Child & Teen", "ADHD", "Anxiety"],
    gradient: "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 50%, #f48fb1 100%)",
    icon: "🌸",
    slug: "dr-kavitha-nair",
  },
  {
    id: 4,
    name: "Dr. Rohit Kapoor",
    title: "Addiction Counselor",
    specializations: ["Addiction", "Stress", "Trauma"],
    gradient: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 50%, #ffcc80 100%)",
    icon: "🌿",
    slug: "dr-rohit-kapoor",
  },
  {
    id: 5,
    name: "Dr. Meera Reddy",
    title: "Counseling Psychologist",
    specializations: ["Self-Esteem", "Grief", "Mindfulness"],
    gradient: "linear-gradient(135deg, #ede7f6 0%, #d1c4e9 50%, #b39ddb 100%)",
    icon: "🦋",
    slug: "dr-meera-reddy",
  },
];

export function HeroIllustration() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
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
    const diff = index - active;
    const count = therapists.length;
    // Normalize to range [-2, 2]
    let offset = diff;
    if (offset > count / 2) offset -= count;
    if (offset < -count / 2) offset += count;

    const absOffset = Math.abs(offset);
    const translateX = offset * 72;
    const translateZ = -absOffset * 120;
    const rotateY = offset * -12;
    const scale = 1 - absOffset * 0.12;
    const opacity = absOffset > 2 ? 0 : 1 - absOffset * 0.25;
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
      className="relative h-[420px] w-full lg:h-[480px]"
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
            {/* Card */}
            <div className="w-[240px] overflow-hidden rounded-2xl border border-border bg-white shadow-lg sm:w-[260px]">
              {/* Gradient top with icon */}
              <div
                className="relative flex h-32 items-center justify-center sm:h-36"
                style={{ background: therapist.gradient }}
              >
                <span className="text-5xl" aria-hidden="true">{therapist.icon}</span>
                {/* Abstract decoration */}
                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/20" />
                <div className="absolute -bottom-3 -left-3 h-14 w-14 rounded-full bg-white/15" />
              </div>

              {/* Body */}
              <div className="p-4">
                <p className="text-sm font-bold text-text">{therapist.name}</p>
                <p className="mt-0.5 text-[11px] text-text-secondary">{therapist.title}</p>

                {/* Specializations */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {therapist.specializations.map((s) => (
                    <span key={s} className="rounded-full bg-primary-light px-2.5 py-0.5 text-[10px] font-medium text-primary">
                      {s}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                {index === active && (
                  <Link
                    href={`/therapists/${therapist.slug}`}
                    className="mt-3 block rounded-lg bg-primary py-2 text-center text-xs font-medium text-white hover:bg-primary-hover"
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
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2">
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

      {/* Prev/Next arrows */}
      <button
        type="button"
        onClick={prev}
        className="absolute left-0 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white/90 text-text-secondary shadow-sm transition-colors hover:border-primary hover:text-primary"
        aria-label="Previous therapist"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-0 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white/90 text-text-secondary shadow-sm transition-colors hover:border-primary hover:text-primary"
        aria-label="Next therapist"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Floating badge */}
      <div className="absolute right-2 top-4 z-20 rounded-lg border border-border bg-white/95 px-3 py-2 shadow-sm backdrop-blur-sm sm:right-4 sm:top-6">
        <p className="text-[10px] text-text-secondary">Verified Therapists</p>
        <p className="text-sm font-bold text-text">120+ Online</p>
      </div>
    </div>
  );
}
