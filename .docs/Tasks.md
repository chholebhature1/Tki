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

### Phase 4.3.2: Demo Data & Therapist Repository

- [x] Seed migration: 10 therapists, 3 patients, 20 appointments, 13 reviews
- [x] All junction tables populated (specializations, languages)
- [x] TherapistRepository (findAll, findBySlug, findFeatured, findSimilar)
- [x] /find-therapists now queries real Supabase data
- [x] /therapists/[slug] now queries real Supabase data
- [x] Similar Therapists section uses repository
- [x] Generated updated database types

### Phase 4.3.3: Therapist Availability

- [x] `therapist_availability` table (weekly schedule, slot duration, buffer)
- [x] `therapist_blocked_periods` table (holidays, leave)
- [x] `slot_locks` table (temporary booking reservation, 5-min TTL)
- [x] RLS policies for all three tables
- [x] Seeded availability (Mon-Sat, morning + afternoon) for all 10 therapists
- [x] `AvailabilityRepository` (getAvailableDates, getAvailableSlots)
- [x] Server Actions (getAvailableDates, getAvailableSlots)
- [x] Booking wizard connected to real availability data
- [x] Booking page fetches therapist from repository (not mock)
- [x] Loading states for date/slot fetching

### Phase 4.3.4: Booking Creation & Appointment Lifecycle

- [x] BookingService (createBooking, lockSlot)
  - Validates therapist exists + approved
  - Checks for duplicate bookings
  - Verifies slot lock ownership + expiry
  - Creates appointment with status `payment_pending`
  - Generates unique booking reference (TKI-XXXXX-XXXX)
  - Removes slot lock after successful creation
- [x] Server Actions (createBookingAction, lockSlotAction)
  - Authenticates user before booking
  - Returns typed BookingResult
- [x] Booking wizard submits real booking on step 5
  - Locks slot when time is selected
  - Creates appointment on "Continue to Payment"
  - Redirects to /payment/[appointmentId]
  - Shows error messages if booking fails
- [x] Payment page loads real appointment data when available
  - Falls back to mock data for demo
- [x] Error handling: expired lock, duplicate booking, unauthenticated

### Phase 4.3.5: Payment Confirmation Workflow

- [x] PaymentService (confirmPayment, markPaymentFailed)
  - Validates appointment exists
  - Verifies patient ownership
  - Enforces status transition: only payment_pending → confirmed
  - Returns typed PaymentResult
- [x] Server Actions (confirmPaymentAction, markPaymentFailedAction)
  - Authenticates user
  - Delegates to service layer
- [x] Payment page calls confirmPaymentAction on success
  - Real appointment status updated to `confirmed` in database
  - Redirects to /appointments/[id] on "View Appointment"
- [x] Payment failure calls markPaymentFailedAction
  - Appointment stays in payment_pending for retry
- [x] PaymentPageContent receives real appointmentId from page
- [x] PaymentSuccess supports onViewAppointment callback
- [x] PaymentFailed shows server error messages

### Phase 4.4: Appointment Management

- [x] AppointmentService with validated status transitions
  - cancelAppointment (patient or therapist)
  - rescheduleAppointment
  - markCompleted (therapist only)
  - markNoShow (therapist only)
  - Transition matrix enforced (e.g. only confirmed → completed)
- [x] Server Actions (cancel, reschedule, markCompleted, markNoShow)
  - All authenticate user
  - All verify ownership/authorization
- [x] Extended AppointmentRepository
  - getUpcoming(userId) — future confirmed/pending
  - getPast(userId) — historical appointments
  - getTherapistAppointments(therapistProfileId) — therapist view
- [x] Reusable components:
  - AppointmentStatusBadge (color-coded per status)
  - AppointmentCard (clickable, shows therapist/patient, date, time, mode)
  - AppointmentActions (cancel button with confirmation, join placeholder)
- [x] Appointment Detail page now includes actions (cancel, join session placeholder)

### Phase 5.1: Patient Dashboard

- [x] DashboardRepository.getPatientDashboard() — stats + upcoming + recent
- [x] Patient layout (sidebar + mobile bottom nav + auth guard)
- [x] DashboardSidebar (logo, nav items, user info, logout)
- [x] DashboardMobileNav (top bar + bottom tab nav)
- [x] StatCard (reusable stat component)
- [x] Dashboard page:
  - Greeting with time-of-day
  - Next appointment notice
  - 4 stat cards (upcoming, completed, cancelled, total)
  - Quick actions (find therapist, book session, edit profile)
  - Upcoming appointments list (real data, AppointmentCard)
  - Recent activity
  - Empty state with CTA
- [x] Route protection (redirects unauthenticated to login)
- [x] Mobile-friendly with bottom padding for fixed nav

### Phase 5.2: Therapist Dashboard

- [x] TherapistDashboardRepository.getDashboard() — stats, today's schedule, upcoming, availability summary
- [x] Therapist layout (auth guard, role verification, sidebar)
- [x] TherapistSidebar (nav: dashboard, appointments, availability, patients, profile, settings)
- [x] /therapist/dashboard page:
  - Welcome greeting
  - 4 stat cards (today's sessions, upcoming, completed today, active patients)
  - Today's schedule (AppointmentCard with showPatient)
  - Upcoming sessions
  - Availability summary (working days, hours, slot duration)
  - Quick actions
  - Empty states
- [x] Role-based redirects (patients → /dashboard, admins → /admin)
- [x] Reuses: StatCard, AppointmentCard, DashboardMobileNav

### Phase 5.3: Google OAuth

- [x] `signInWithGoogle()` server action (uses supabase.auth.signInWithOAuth)
- [x] `GoogleSignInButton` component (branded Google icon, loading state, error handling)
- [x] Login page updated: Google button primary, email/password below divider
- [x] Register page updated: same pattern
- [x] Redirects through existing /auth/callback route
- [x] Profile auto-created via existing handle_new_user() trigger
- [x] Graceful error handling (cancelled login, provider unavailable)

**Supabase Dashboard Configuration Required:**
- Enable Google provider in Authentication → Providers → Google
- Set Google Client ID and Secret (from Google Cloud Console)
- Add redirect URL: `https://klmwkaqylpivwbggvzlb.supabase.co/auth/v1/callback`
- Add site URL: `http://localhost:3000` (dev) or production URL

### Phase 5.4: Admin Dashboard (MVP)

- [x] AdminRepository (getStats, getTherapists, getUsers, getReviews, updateVerificationStatus, updateUserActiveStatus)
- [x] Server Actions (approve/reject/suspend therapist, activate/deactivate user)
- [x] Admin layout (role-based guard: admin only, redirects non-admins)
- [x] AdminSidebar (6 nav items)
- [x] /admin/dashboard — real stats (users, patients, therapists, verification, appointments, rating)
- [x] /admin/therapists — table with approve/reject/suspend actions
- [x] /admin/users — table with activate/deactivate actions
- [x] /admin/appointments — list using AppointmentCard
- [x] /admin/reviews — table with ratings and comments
- [x] /admin/settings — simple form (platform name, email, phone, fee %)
- [x] Reuses: StatCard, AppointmentCard, AppointmentStatusBadge, Logo

#### Phase 5.4.1: Admin Dashboard Polish

- [x] Created VerificationBadge component (proper verification status colors)
- [x] Replaced misused AppointmentStatusBadge in therapist table
- [x] Added confirmation dialogs to all destructive actions
- [x] Added loading states to all action buttons
- [x] Added empty states to therapists and users pages
- [x] Added row hover effects to all tables
- [x] Added quick action cards to dashboard
- [x] Added focus-visible rings to all action buttons
- [x] Added count displays in page headers
- [x] Improved overall accessibility

## Pending

### Phase 6: LiveKit Video Consultation

- [x] Phase 6.1: Architecture & Foundation
  - Installed: @livekit/components-react, @livekit/components-styles, livekit-client, livekit-server-sdk
  - Created feature structure: types, constants, repositories, services, actions, components
  - Types: MeetingParticipant, MeetingRole, MeetingState, ConnectionStatus, MediaState, etc.
  - Constants: ROOM_PREFIX, TOKEN_EXPIRATION, EARLY_JOIN_MINUTES, CONNECTION_TIMEOUT
  - Services: validateLiveKitConfig, getRoomName, generateToken (stub), validateParticipant (stub)
  - Repository: MeetingRepository (getRoomInfo, recordJoin, recordLeave stubs)
  - Actions: generateMeetingTokenAction, joinMeetingAction, leaveMeetingAction (stubs)
  - Components: ConsultationRoom, ParticipantTile, ControlBar, WaitingScreen, PermissionScreen, ConnectionStatus, LoadingScreen, ErrorScreen
  - Environment validated: LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET configured

- [x] Phase 6.2: Secure Token Generation & Authorization
  - LiveKitService: validateLiveKitConfig, getRoomName, buildParticipantIdentity, generateToken (JWT via livekit-server-sdk)
  - MeetingRepository: validateParticipant (checks ownership + status), getRoomInfo, recordJoin/recordLeave (stubs)
  - MeetingService: authorizeMeetingJoin (orchestrates validation → token generation)
  - Server Action: generateMeetingTokenAction (authenticates → authorizes → returns token)
  - Security: only confirmed appointments, only assigned patient/therapist, secrets never exposed
  - Room naming: tki-consultation-{appointmentId}
- [x] Phase 6.3: Protected Consultation Route
  - /consultation/[appointmentId] — Server Component with full authorization
  - Join window: 15 min before → session end + 15 min after
  - Status checks: only "confirmed" generates tokens
  - Participant validation: patient or assigned therapist only
  - Time window validation with configurable EARLY/LATE_JOIN_MINUTES
  - UX: ConsultationUnavailable (too_early, ended, cancelled, payment_pending, unauthorized, not_found)
  - UX: ConsultationReady (shows token/room confirmation, participant info)
  - Redirect unauthenticated to login with return URL
- [ ] Phase 6.4: LiveKit Video Room Implementation

- [ ] Database migrations (profiles, roles, therapist_profiles)
- [ ] Therapist discovery
- [ ] Booking engine
- [ ] Payment integration
- [ ] Video consultation
- [ ] Dashboards
- [ ] Admin portal
