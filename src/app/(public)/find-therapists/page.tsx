import { Container } from "@/components/layout";
import {
  SearchHeader,
  FilterSidebar,
  SortDropdown,
  TherapistListingCard,
  Pagination,
  MobileFilterDrawer,
  mockTherapistsList,
} from "@/features/therapists";

export const metadata = {
  title: "Find a Therapist",
  description:
    "Browse verified mental health professionals. Filter by specialization, language, experience, and more.",
};

export default function FindTherapistsPage() {
  return (
    <section className="bg-surface py-8 sm:py-10 lg:py-12">
      <Container>
        {/* Search Header */}
        <SearchHeader />

        {/* Toolbar */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MobileFilterDrawer />
            <p className="text-sm text-text-secondary">
              <span className="font-medium text-text">{mockTherapistsList.length}</span> therapists found
            </p>
          </div>
          <SortDropdown />
        </div>

        {/* Content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-border bg-white p-5">
              <FilterSidebar />
            </div>
          </div>

          {/* Therapist Grid */}
          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              {mockTherapistsList.map((therapist) => (
                <TherapistListingCard
                  key={therapist.id}
                  therapist={therapist}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8">
              <Pagination currentPage={1} totalPages={3} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
