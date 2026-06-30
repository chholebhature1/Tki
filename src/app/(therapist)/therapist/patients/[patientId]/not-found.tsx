import Link from "next/link";
import { Users } from "lucide-react";

export default function PatientNotFound() {
  return (
    <div className="mx-auto max-w-3xl py-16 text-center">
      <Users className="mx-auto h-12 w-12 text-muted" aria-hidden="true" />
      <h1 className="mt-4 text-xl font-bold text-text">Patient Not Found</h1>
      <p className="mt-2 text-sm text-text-secondary">
        This patient doesn&apos;t exist or you don&apos;t have access to their records.
      </p>
      <Link
        href="/therapist/patients"
        className="mt-6 inline-block rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover"
      >
        Back to Patients
      </Link>
    </div>
  );
}
