import { Suspense } from "react";
import {
  HeroSection,
  TrustSection,
  CategoriesSection,
  HowItWorksSection,
  FeaturedTherapistsSection,
  TestimonialsSection,
} from "@/features/home";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <CategoriesSection />
      <HowItWorksSection />
      <Suspense fallback={null}>
        <FeaturedTherapistsSection />
      </Suspense>
      <TestimonialsSection />
    </>
  );
}
