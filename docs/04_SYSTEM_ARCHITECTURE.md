# 04_SYSTEM_ARCHITECTURE.md

# TalkIndia

## System Architecture Specification

Version: 1.0

Status: Architecture Approved

Dependencies

* 00_PROJECT_OVERVIEW.md
* 01_PRODUCT_REQUIREMENTS.md
* 02_USER_FLOWS.md
* 03_INFORMATION_ARCHITECTURE.md

---

# 1. Purpose

This document defines the technical architecture of TalkIndia.

Every developer and AI coding assistant must follow this architecture.

The purpose is to ensure:

* Maintainability
* Scalability
* Security
* Performance
* Consistency

This document is the architectural source of truth.

---

# 2. Architecture Overview

TalkIndia follows a modern full-stack architecture.

Client

↓

Next.js App Router

↓

Server Actions

↓

Service Layer

↓

Repository Layer

↓

Supabase

↓

PostgreSQL

↓

Storage

↓

Realtime

External Services

↓

Payment Gateway

↓

Video Provider

↓

Email Provider

---

# 3. Technology Stack

Frontend

* Next.js 15+
* React 19
* TypeScript
* Tailwind CSS
* shadcn/ui

Backend

* Supabase
* PostgreSQL
* Server Actions
* Route Handlers (webhooks)

Authentication

* Supabase Auth

Validation

* Zod

Forms

* React Hook Form

State Management

* TanStack Query (Server State)
* React Context (Global UI State)

Payments

* Razorpay

Video

* LiveKit

Email

* Resend

Deployment

* Vercel

Version Control

* GitHub

---

# 4. Project Folder Structure

```text
talkindia/

app/
components/
features/
lib/
services/
repositories/
actions/
hooks/
providers/
middleware/
types/
utils/
constants/
schemas/
styles/
public/
supabase/
docs/
```

Every folder has a single responsibility.

---

# 5. Feature-Based Architecture

Business logic must be grouped by feature.

Example:

```text
features/

authentication/
booking/
payments/
therapists/
patients/
reviews/
notifications/
admin/
blog/
```

Each feature should remain independent.

Avoid cross-feature dependencies whenever possible.

---

# 6. Next.js App Router Structure

```text
app/

(layout)

(page)

(auth)

(patient)

(therapist)

(admin)

api/

not-found.tsx

error.tsx

loading.tsx
```

Use nested layouts.

Avoid duplicated layout code.

---

# 7. Component Architecture

Three component types:

### Shared Components

Reusable across the application.

Examples:

* Button
* Card
* Input
* Modal
* Badge

---

### Feature Components

Specific to one feature.

Example

Booking Calendar

Therapist Card

Appointment Timeline

---

### Layout Components

Navbar

Sidebar

Footer

Breadcrumb

Dashboard Layout

---

# 8. Server vs Client Components

Default Rule

Every page should be a Server Component unless interactivity requires otherwise.

Client Components only when:

* Form input
* State
* Browser APIs
* Event listeners
* Charts

Prefer server rendering.

---

# 9. Server Actions

Business operations must use Server Actions where appropriate.

Examples

Create Appointment

Cancel Appointment

Update Availability

Create Review

Upload Profile

Do not expose sensitive logic to the client.

---

# 10. Service Layer

Business logic belongs in services.

Examples

BookingService

PaymentService

TherapistService

NotificationService

ReviewService

Never place business logic inside React components.

---

# 11. Repository Layer

Repositories communicate with Supabase.

Responsibilities

* Read
* Insert
* Update
* Delete

Services call repositories.

Components never access the database directly.

---

# 12. Validation Layer

Every request must be validated.

Use Zod schemas.

Validation exists for:

* Forms
* API input
* Server Actions
* Database operations

Never trust client input.

---

# 13. Environment Variables

Secrets remain server-side.

Example categories:

* Supabase URL
* Supabase Service Role Key
* Razorpay Secret
* LiveKit Secret
* Email Provider API Key

Never expose secrets in client bundles.

---

# 14. Authentication Architecture

Authentication flow:

User

↓

Supabase Auth

↓

Session

↓

Middleware

↓

Protected Route

↓

Authorized Content

Every protected route must verify the authenticated user.

---

# 15. Authorization Strategy

Role-Based Access Control (RBAC)

Roles:

Guest

Patient

Therapist

Admin

Permissions are enforced in:

* Middleware
* Server Actions
* Database (RLS)

Never rely only on client-side checks.

---

# 16. Data Fetching Strategy

Prefer server-side fetching.

Use:

* Server Components
* TanStack Query for client-side synchronization when necessary

Avoid unnecessary client fetching.

---

# 17. File Upload Architecture

Uploads:

* Therapist Certificates
* Profile Photos
* Documents

Storage:

Supabase Storage

Rules:

Validate file type.

Validate size.

Generate unique filenames.

Restrict bucket access.

---

# 18. Error Handling

Every feature must support:

Loading

Success

Empty

Validation Error

Unauthorized

Forbidden

Unexpected Error

Use centralized error utilities.

Never expose internal error details.

---

# 19. Logging Strategy

Log:

Authentication failures

Payment events

Appointment events

Verification actions

Unexpected server errors

Do not log sensitive personal information.

---

# 20. Notifications

Notifications are sent inline by the service layer after key actions.

Events that trigger notifications:

- Appointment confirmed → email + DB notification
- Appointment cancelled → email + DB notification
- Appointment reminder → email (via cron)
- Payment success → email
- Therapist approved → email + DB notification

Implementation:
- Insert a row into the `notifications` table (for in-app display).
- Call Resend API to send an email (best-effort, don't block on failure).

No notification queue or delivery tracking needed for MVP.

---

# 21. Performance Guidelines

Use Server Components where possible.

Optimize images.

Lazy load heavy components.

Paginate large datasets.

Avoid duplicate database queries.

Minimize client JavaScript.

---

# 22. Security Principles

Mandatory:

* Row Level Security on every table
* Server-side validation (Zod)
* Input sanitization
* Rate limiting on auth endpoints (Supabase built-in)
* Secure cookies (Supabase Auth handles this)
* HTTPS (handled by Vercel)
* Never expose service_role key to client
* Verify Razorpay webhook signatures server-side

---

# 23. Deployment Architecture

GitHub

↓

Preview Deployment

↓

Vercel

↓

Production

Supabase remains the managed backend.

Database migrations must be version-controlled.

---

# 24. Coding Standards

* Strict TypeScript
* No `any`
* No duplicated logic
* Single responsibility
* Reusable components
* Meaningful filenames
* Feature-first organization
* Small focused functions

---

# 25. AI Development Rules (Kiro)

Before implementing any feature:

1. Read all relevant documentation in `/docs`.
2. Do not invent architecture.
3. Follow folder structure exactly.
4. Keep features isolated.
5. Reuse existing components.
6. Never bypass validation.
7. Never bypass RLS.
8. Update `Tasks.md` after completing work.
9. Create meaningful Git commits.
10. Ask for clarification if documentation conflicts.

---

# 26. Acceptance Criteria

The architecture is considered correctly implemented when:

* Features are modular.
* Components are reusable.
* Business logic is isolated.
* Database access is centralized.
* Validation is consistent.
* Protected routes are secure.
* Deployment is reproducible.
* New modules can be added without major refactoring.

---

# End of Document
