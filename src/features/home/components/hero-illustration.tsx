"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

interface TherapistCard {
  id: number;
  name: string;
  title: string;
  specializations: string[];
  rating: string;
  experience: string;
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
    rating: "4.9",
    experience: "12 yrs",
    gradient: "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 50%, #80deea 100%)",
    image: "/images/therapists/priya-sharma.jpg",
    slug: "dr-priya-sharma",
  },
  {
    id: 2,
    name: "Dr. Arjun Mehta",
    title: "Psychiatrist",
    specializations: ["Relationships", "Family", "Career"],
    rating: "4.8",
    experience: "8 yrs",
    gradient: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)",
    image: "/images/therapists/arjun-mehta.jpg",
    slug: "dr-arjun-mehta",
  },
  {
    id: 3,
    name: "Dr. Kavitha Nair",
    title: "Child & Adolescent Psychologist",
    specializations: ["Child & Teen", "ADHD", "Anxiety"],
    rating: "4.9",
    experience: "10 yrs",
    gradient: "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 50%, #f48fb1 100%)",
    image: "/images/therapists/kavitha-nair.jpg",
    slug: "dr-kavitha-nair",
  },
  {
    id: 4,
    name: "Dr. Rohit Kapoor",
    title: "Addiction Counselor",
    specializations: ["Addiction", "Stress", "Trauma"],
    rating: "4.7",
    experience: "15 yrs",
    gradient: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 50%, #ffcc80 100%)",
    image: "/images/therapists/rohit-kapoor.jpg",
    slug: "dr-rohit-kapoor",
  },
  {
    id: 5,
    name: "Dr. Meera Reddy",
    title: "Counseling Psychologist",
    specializations: ["Self-Esteem", "Grief", "Mindfulness"],
    rating: "4.8",
    experience: "7 yrs",
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
  const containerRef = useRef<HTMLDivElement>(null);

  // Fade in on mount to prevent hydration flash
  useEffect(() => {
    const el = containerRef.current;
    if (el) el.style.opacity = "1";
  }, []);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % therapists.length);
  }, []);

  const prev = useCallback(() => {
    setActive((i) => (i - 1 + therapists.length) % therapists.length);
  }, []);

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
    const translateX = offset * 72;
    const translateZ = -absOffset * 100;
    const rotateY = offset * -12;
    const scale = 1 - absOffset * 0.08;
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
      ref={containerRef}
      className="relative flex flex-col items-center transition-opacity duration-500 opacity-0"
      aria-label="Featured therapists carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Heading */}
      <div className="mb-4 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[3px] text-primary">Trusted Professionals</p>
        <h2 className="mt-1 text-xl font-bold text-text sm:text-2xl">Our Top Therapists</h2>
      </div>

      {/* 3D Carousel Stage — full height */}
      <div
        className="relative h-[600px] w-full sm:h-[680px]"
        style={{ perspective: "1000px" }}
      >
        {therapists.map((therapist, index) => (
          <div
            key={therapist.id}
            className="absolute left-1/2 top-0 -ml-[115px] transition-all duration-500 ease-out sm:-ml-[125px]"
            style={getCardStyle(index)}
          >
            {/* Card — image is 4:5, plus info below */}
            <div className="flex w-[230px] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-lg sm:w-[250px]">
              {/* Image container — strict 4:5 aspect ratio */}
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: "4/5", background: therapist.gradient }}
              >
                {!failedImages[therapist.id] ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={therapist.image}
                    alt={therapist.name}
                    className="h-full w-full object-cover object-top transition-transform duration-500"
                    style={{ transform: index === active ? "scale(1.04)" : "scale(1)" }}
                    loading="lazy"
                    onError={() => setFailedImages((p) => ({ ...p, [therapist.id]: true }))}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <svg viewBox="0 0 100 130" className="h-4/5 w-3/5 opacity-25" fill="none">
                      <ellipse cx="50" cy="40" rx="22" ry="24" fill="currentColor" className="text-text" />
                      <path d="M50 64 C30 72, 20 95, 28 120 L72 120 C80 95, 70 72, 50 64Z" fill="currentColor" className="text-text" opacity="0.7" />
                    </svg>
                  </div>
                )}
                {/* Rating badge */}
                <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-text shadow-sm backdrop-blur-sm">
                  <span className="text-warning">★</span> {therapist.rating}
                </div>
              </div>

              {/* Info below image */}
              <div className="flex flex-col gap-2 p-3.5">
                <div>
                  <p className="text-sm font-bold leading-tight text-text">{therapist.name}</p>
                  <p className="mt-0.5 text-[10px] text-text-secondary">{therapist.title}</p>
                  <p className="mt-0.5 text-[10px] text-muted">{therapist.experience} experience</p>
                </div>

                {/* Specialization chips */}
                <div className="flex flex-wrap gap-1">
                  {therapist.specializations.map((s) => (
                    <span key={s} className="rounded-full bg-primary-light px-2 py-0.5 text-[9px] font-medium text-primary">
                      {s}
                    </span>
                  ))}
                </div>

                {/* Buttons — only on active card */}
                {index === active && (
                  <div className="flex gap-2 pt-1">
                    <Link
                      href={`/book/${therapist.slug}`}
                      className="flex-1 rounded-lg bg-primary py-1.5 text-center text-[10px] font-semibold text-white hover:bg-primary-hover"
                    >
                      Book Now
                    </Link>
                    <Link
                      href={`/therapists/${therapist.slug}`}
                      className="flex-1 rounded-lg border border-border py-1.5 text-center text-[10px] font-semibold text-text-secondary hover:border-primary hover:text-primary"
                    >
                      Profile
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

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
      </div>

      {/* Navigation dots */}
      <div className="mt-4 flex gap-2">
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

      {/* Show All link */}
      <Link
        href="/find-therapists"
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover"
      >
        View All Therapists
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}
