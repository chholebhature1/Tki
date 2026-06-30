"use client";

import { Container } from "@/components/layout/container";

export default function PublicError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="flex min-h-[50vh] items-center justify-center">
      <Container className="text-center">
        <p className="text-sm font-medium text-danger">Something went wrong</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-text sm:text-3xl">
          An unexpected error occurred
        </h1>
        <p className="mt-4 text-text-secondary">
          Please try again. If the problem persists, contact support.
        </p>
        <button
          onClick={reset}
          className="mt-8 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          Try again
        </button>
      </Container>
    </section>
  );
}
