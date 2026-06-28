# TalkIndia — Tasks

## Completed

### Phase 1: Project Foundation (Partial)

- [x] Initialize Next.js 15 project with TypeScript
- [x] Configure Tailwind CSS v4 with design tokens
- [x] Configure ESLint
- [x] Set up folder structure (src/app, src/components, src/lib, src/constants)
- [x] Create global CSS with brand color palette
- [x] Create reusable Container component
- [x] Create responsive Navbar with mobile drawer
- [x] Create responsive Footer with link sections
- [x] Create public layout (Navbar + Main + Footer)
- [x] Configure SEO metadata (title template, Open Graph, Twitter)
- [x] Add skip-to-content link (accessibility)
- [x] Add 404 Not Found page
- [x] Add loading spinner component
- [x] Configure font (Geist)
- [x] Verify build passes
- [x] Verify lint passes
- [x] Hero section (headline, CTAs, search, trust badges, stats, illustration)
- [x] Trust & Credibility section (trust strip, "Why people choose TalkIndia" feature cards)
- [x] Therapy Categories section (8 categories, reusable CategoryCard, responsive grid)
- [x] How It Works section (4 steps with connecting line, reusable StepCard)
- [x] Featured Therapists section (4 mock therapists, reusable TherapistCard, 2×2 grid)
- [x] Testimonials section (3 testimonials, reusable TestimonialCard, 3-col grid)

### Phase 2: Authentication

- [x] Supabase client setup (browser + server + proxy)
- [x] Auth proxy (session refresh, route protection, role-aware redirects)
- [x] Auth schemas (Zod: login, register, forgot-password, reset-password)
- [x] Server Actions (login, register, forgot-password, reset-password, logout)
- [x] Auth callback route handler (/auth/callback)
- [x] Reusable form components (FormField, Input, SubmitButton, AuthCard)
- [x] Login page (/login)
- [x] Register page (/register)
- [x] Forgot Password page (/forgot-password)
- [x] Reset Password page (/reset-password)
- [x] Email verification flow (via Supabase + callback route)
- [x] Protected route middleware (dashboard, therapist, admin routes)
- [x] Redirect authenticated users away from auth pages

### Phase 3.1: Therapist Discovery Foundation

- [x] Therapist types (Therapist, SortOption, TherapistFilters, ConsultationMode)
- [x] Mock data (12 typed therapists + filter options)
- [x] TherapistListingCard (avatar, badge, bio, meta, specializations, fee, CTA)
- [x] SearchHeader (title, description, search input)
- [x] FilterSidebar (8 filter groups, desktop)
- [x] MobileFilterDrawer (slide-in drawer for mobile)
- [x] SortDropdown (5 sort options)
- [x] Pagination (page buttons)
- [x] /find-therapists page (server component, grid layout, sidebar + cards)

### Phase 3.2: Therapist Profile

- [x] Extended types (TherapistProfile, Education, Certification, Review, AvailabilitySlot)
- [x] Detailed mock profile data (full bio, education, certs, availability, 5 reviews)
- [x] Profile Hero (avatar, name, badges, meta, languages)
- [x] About section (multi-paragraph bio)
- [x] Areas of Expertise (specialization chips)
- [x] Consultation Details (duration, mode, response time, cancellation)
- [x] Education (timeline with dots)
- [x] Certifications (icon cards)
- [x] Weekly Availability (slot grid)
- [x] Reviews section (5 reviews with stars, badges, metadata)
- [x] Sticky Booking Card (desktop sidebar: fee, duration, slot, CTA)
- [x] Mobile Booking CTA (fixed bottom bar)
- [x] Similar Therapists (reuses TherapistListingCard)
- [x] /therapists/[slug] page (dynamic route, server component)

### Phase 4.1: Booking Wizard

- [x] Booking types (ConsultationType, TimeSlot, BookingDate, PatientDetails, BookingState)
- [x] Mock data (14 dates, 17 time slots, therapist info, language options)
- [x] StepIndicator (5-step progress bar)
- [x] Step 1: Consultation Type (video/audio cards)
- [x] Step 2: Date Selection (2-week calendar grid)
- [x] Step 3: Time Selection (morning/afternoon/evening groups)
- [x] Step 4: Patient Details (reason, language, notes)
- [x] Step 5: Review (summary with fee breakdown, cancellation policy)
- [x] BookingSummarySidebar (sticky desktop sidebar)
- [x] BookingWizard (multi-step state machine, navigation)
- [x] /book/[therapistSlug] page

### Phase 4.2: Payment Experience

- [x] Payment types (PaymentMethod, PaymentStatus, PaymentSummary)
- [x] Mock payment data (booking summary with fee breakdown)
- [x] PaymentMethodSelector (UPI recommended, Card, Net Banking)
- [x] OrderSummary sidebar (therapist, date, time, fee breakdown, trust badge)
- [x] PaymentProcessing screen (spinner, wait message)
- [x] PaymentSuccess screen (booking ID, details, join instructions, CTAs)
- [x] PaymentFailed screen (error message, retry, change method, support)
- [x] PaymentPageContent (state machine: idle → processing → success/failed)
- [x] /payment/[bookingId] page

### Phase 4.3: Appointment Details + Database Integration

- [x] Database schema created (hosted Supabase):
  - Enums: app_role, verification_status, consultation_mode, appointment_status, gender_type
  - Tables: roles, profiles, therapist_profiles, specializations, languages, therapist_specializations, therapist_languages, appointments, reviews, notifications
  - Indexes on all primary query columns
  - Seeded: roles (3), specializations (14), languages (11)
- [x] RLS enabled on all tables with policies:
  - Helper functions: get_user_role(), is_admin()
  - profiles: owner select/update, insert own
  - therapist_profiles: public select (verified), owner update/insert
  - appointments: patient select own, therapist select assigned
  - reviews: public read, patient insert
  - notifications: owner select/update
  - lookups: public read
- [x] Generated TypeScript database types (src/lib/supabase/database.types.ts)
- [x] AppointmentRepository (findById, findByPatient) with proper JOIN queries
- [x] AppointmentDetailCard component (status badge, therapist info, details grid)
- [x] /appointments/[appointmentId] page (Server Component, real Supabase queries)

### Phase 4.3.1: Auth & Profile Synchronization

- [x] `handle_new_user()` trigger function (auto-creates profile on signup)
- [x] `on_auth_user_created` trigger on auth.users
- [x] Default Patient role assignment (never NULL role_id)
- [x] UPSERT/ON CONFLICT protection against duplicate profiles
- [x] `update_updated_at_column()` reusable trigger function
- [x] `set_updated_at` triggers on: profiles, therapist_profiles, appointments, reviews
- [x] Regenerated database types
- [x] Migration file: `20240701000001_auth_profile_sync.sql`

## Pending

- [ ] Database migrations (profiles, roles, therapist_profiles)
- [ ] Therapist discovery
- [ ] Booking engine
- [ ] Payment integration
- [ ] Video consultation
- [ ] Dashboards
- [ ] Admin portal
