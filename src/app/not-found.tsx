import Link from "next/link";
import { Container } from "@/components/layout";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Container className="text-center">
        <p className="text-sm font-medium text-primary">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 text-text-secondary">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          Go back home
        </Link>
      </Container>
    </div>
  );
}
