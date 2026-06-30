"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/layout";
import { Tiles } from "@/components/ui/tiles";
import { HeroIllustration } from "./hero-illustration";
import { HeroSearch } from "./hero-search";
import { TrustBadges } from "./trust-badges";
import { HeroStats } from "./hero-stats";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-surface py-10 sm:py-12 lg:py-14">
      {/* Interactive Tiles Background */}
      <div className="absolute inset-0 z-0 opacity-100" aria-hidden="true">
        <Tiles rows={60} cols={12} tileSize="md" />
      </div>

      {/* Subtle background decoration */}
      <div
        className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl"
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Left — Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col lg:pt-10"
          >
            {/* Headline group — tighter internal spacing */}
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-text sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
              Find the Right{" "}
              <span className="text-primary">Mental Health</span>{" "}
              Professional
            </h1>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-text-secondary sm:mt-5">
              Book verified therapists, attend secure video consultations, and
              take the first step toward better mental health — all from the
              comfort of your home.
            </p>

            {/* Search — more breathing room */}
            <div className="mt-8">
              <HeroSearch />
            </div>

            {/* CTAs — prominent sizing */}
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/find-therapists"
                className="rounded-xl bg-primary px-7 py-3.5 text-base font-medium text-white shadow-sm transition-all hover:bg-primary-hover hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Book Appointment
              </Link>
              <Link
                href="/find-therapists"
                className="rounded-xl border border-border bg-white px-7 py-3.5 text-base font-medium text-text transition-all hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Find Therapist
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-8">
              <TrustBadges />
            </div>
          </motion.div>

          {/* Right — Featured Therapists Carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
            className="hidden lg:block"
          >
            <HeroIllustration />
          </motion.div>
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          className="mt-10 rounded-2xl border border-border bg-white px-6 py-6 shadow-sm sm:px-8 lg:mt-14"
        >
          <HeroStats />
        </motion.div>
      </Container>
    </section>
  );
}
