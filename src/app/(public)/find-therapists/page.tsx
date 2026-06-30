import { Container } from "@/components/layout";
import {
  SearchHeader,
  FilterSidebar,
  SortDropdown,
  TherapistListingCard,
  Pagination,
  MobileFilterDrawer,
  TherapistRepository,
} from "@/features/therapists";
import { fallbackTherapists } from "@/features/therapists/constants/fallback-therapists";

export const metadata = {
  title: "Find a Therapist",
  description:
    "Browse verified mental health professionals. Filter by specialization, language, experience, and more.",
};

export default async function FindTherapistsPage() {
  let therapists: Awaited<ReturnType<typeof TherapistRepository.findAll>> = [];
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      therapists = await TherapistRepository.findAll();
    }
  } catch {
    therapists = [];
  }

  // Use fallback data if DB returns empty
  if (therapists.length === 0) {
    therapists = fallbackTherapists;
  }

  return (
    <section className="bg-surface py-8 sm:py-10 lg:py-12">
      <Container>
        <SearchHeader />

        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MobileFilterDrawer />
            <p className="text-sm text-text-secondary">
              <span className="font-medium text-text">{therapists.length}</span> therapists found
            </p>
          </div>
          <SortDropdown />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
          <div className="hidden lg:block">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-border bg-white p-5">
              <FilterSidebar />
            </div>
          </div>

          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              {therapists.map((therapist) => (
                <TherapistListingCard key={therapist.id} therapist={therapist} />
              ))}
            </div>
            <div className="mt-8">
              <Pagination currentPage={1} totalPages={1} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
