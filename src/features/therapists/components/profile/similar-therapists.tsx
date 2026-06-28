import { mockTherapistsList } from "../../constants";
import { TherapistListingCard } from "../therapist-listing-card";

interface SimilarTherapistsProps {
  currentId: string;
}

export function SimilarTherapists({ currentId }: SimilarTherapistsProps) {
  const similar = mockTherapistsList
    .filter((t) => t.id !== currentId)
    .slice(0, 3);

  return (
    <section>
      <h2 className="text-lg font-semibold text-text">Similar Therapists</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {similar.map((therapist) => (
          <TherapistListingCard key={therapist.id} therapist={therapist} />
        ))}
      </div>
    </section>
  );
}
