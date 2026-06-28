# 11_IMPLEMENTATION_ROADMAP.md

# TalkIndia

## Implementation Roadmap

Version: 2.0

Dependencies

* All Project Documentation

---

# 1. Purpose

Defines the implementation sequence for TalkIndia MVP.

Complete one phase before starting the next.

---

# 2. Phases Overview

```text
Phase 1: Project Setup & Design System
Phase 2: Authentication & Profiles
Phase 3: Public Website
Phase 4: Therapist Discovery & Profiles
Phase 5: Booking & Payments
Phase 6: Video Consultation
Phase 7: Dashboards (Patient, Therapist, Admin)
Phase 8: Polish, Deploy & Demo
```

---

# 3. Phase 1 — Project Setup & Design System

Tasks:
- Initialize Next.js 15 project with TypeScript
- Configure Tailwind CSS + shadcn/ui
- Configure ESLint + Prettier
- Set up folder structure (app/, features/, components/, lib/, etc.)
- Create Supabase project, configure auth + storage
- Create database migrations: roles, profiles, lookup tables
- Seed roles (patient, therapist, admin)
- Seed specializations and languages
- Set up environment variables
- Build base design system: colors, typography, buttons, inputs, cards
- Build layout components: Navbar, Footer, Sidebar, DashboardLayout

Deliverables:
- Clean project builds and lints
- Database ready with seeded data
- Reusable component library started
- Git repo initialized with first commit

---

# 4. Phase 2 — Authentication & Profiles

Tasks:
- Login page (email/password + Google OAuth)
- Patient registration
- Therapist registration (multi-step with document upload)
- Forgot/Reset password
- Email verification
- Role-based middleware (protect patient/therapist/admin routes)
- Profile creation on signup (DB trigger or server action)
- Profile edit page (patient)
- Therapist profile edit + verification submission

Deliverables:
- Users can register and log in
- Routes are protected by role
- Profiles are created and editable

---

# 5. Phase 3 — Public Website

Tasks:
- Landing page (hero, search, how it works, featured therapists, FAQ, footer)
- About page
- Contact page
- Blog listing + blog detail (from DB)
- SEO: meta tags, Open Graph, structured data
- Responsive navigation

Deliverables:
- Marketing website complete
- SEO-ready
- Blog works from CMS data

---

# 6. Phase 4 — Therapist Discovery & Profiles

Tasks:
- Therapist search page with filters (specialization, language, gender, price, rating)
- Sorting (recommended, price, rating, experience)
- Therapist profile page (public view)
- Pagination
- Show verification badge, languages, specializations, fee, rating
- Admin: therapist verification workflow (approve/reject)

Deliverables:
- Patients can search and browse verified therapists
- Admin can approve/reject therapist applications

---

# 7. Phase 5 — Booking & Payments

This is the most critical phase.

Tasks:
- Therapist availability management (weekly schedule, blocked periods)
- Dynamic slot generation algorithm
- Booking wizard: consultation type → date → time → review → payment
- Slot locking (slot_locks table)
- Razorpay integration (create order, checkout modal, verify payment)
- Webhook handler (POST /api/webhooks/razorpay)
- Appointment creation + confirmation flow
- Cancellation + rescheduling
- Invoice generation (simple: display appointment + payment details)
- Notifications: booking confirmed, cancelled (email + dashboard)

Deliverables:
- End-to-end booking works: search → book → pay → confirmed
- Payments verified server-side
- No double booking possible
- Notifications sent

---

# 8. Phase 6 — Video Consultation

Tasks:
- LiveKit integration: create room, generate tokens
- Video session created after payment confirmation
- Join meeting page (patient + therapist)
- Join button enabled 15 min before appointment
- End session → mark appointment as completed
- Session attendance tracking
- Review prompt after completion

Deliverables:
- Patient and therapist can join a video call
- Session completes and appointment status updates

---

# 9. Phase 7 — Dashboards

Tasks:

Patient Dashboard:
- Overview (upcoming appointment, quick actions)
- Appointments list (upcoming, completed, cancelled)
- Appointment detail (join, cancel, reschedule)
- Notifications
- Reviews (submit + view)
- Profile + settings

Therapist Dashboard:
- Today's schedule
- Calendar view
- Availability management UI
- Appointments list
- Patients list
- Earnings overview
- Reviews received
- Profile + verification status

Admin Dashboard:
- Platform overview (stats cards)
- Therapist verification queue
- User management
- Appointment monitoring
- Payment overview
- Blog CMS (create, edit, publish)
- Support tickets
- Platform settings
- Audit logs viewer

Deliverables:
- All three dashboards functional
- Each role can perform their core tasks

---

# 10. Phase 8 — Polish, Deploy & Demo

Tasks:
- Responsive testing (mobile, tablet, desktop)
- Loading states and error states everywhere
- Empty states with helpful messages
- Accessibility check (keyboard nav, focus, ARIA)
- Performance: image optimization, lazy loading
- Deploy to Vercel (production)
- Configure custom domain (if available)
- Test full booking flow end-to-end
- Prepare demo script for project evaluation

Deliverables:
- Production deployment live
- All flows work end-to-end
- Ready for project demonstration

---

# 11. Definition of Done (Per Phase)

A phase is complete when:
- Build passes (no TypeScript errors)
- Lint passes
- Feature works end-to-end
- Responsive on mobile + desktop
- Git committed with meaningful message

---

# 12. Risk Areas

| Risk | Mitigation |
|------|-----------|
| Razorpay integration | Test with Razorpay test mode early |
| LiveKit video calls | Test with free tier; have a fallback plan |
| Slot generation logic | Write and test the algorithm in isolation |
| RLS misconfiguration | Test every policy with each role before moving on |

---

# 13. Milestones

| # | Milestone | Indicator |
|---|-----------|-----------|
| 1 | Foundation | Project builds, DB ready |
| 2 | Auth works | Users can register/login |
| 3 | Search works | Patients find therapists |
| 4 | Booking works | End-to-end: search → pay → confirmed |
| 5 | Video works | Patient + therapist can video call |
| 6 | Dashboards | All roles can use their portal |
| 7 | Deployed | Live on Vercel |

---

# End of Document
