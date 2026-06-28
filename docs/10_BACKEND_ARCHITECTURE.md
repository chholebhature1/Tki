# 10_BACKEND_ARCHITECTURE.md

# TalkIndia

## Backend Architecture Specification

Version: 1.0

Dependencies

* 04_SYSTEM_ARCHITECTURE.md
* 06_DATABASE_SCHEMA/*
* 07_API_SPECIFICATION.md
* 08.09_FRONTEND_ARCHITECTURE.md

---

# 1. Purpose

Defines the complete backend architecture of TalkIndia.

This document specifies:

* Service architecture
* Repository pattern
* Server Actions
* Transactions
* Error handling
* Logging
* Security
* Dependency rules

Every backend feature must follow this architecture.

---

# 2. Technology Stack

Framework

Next.js 15 App Router

Runtime

Node.js

Database

PostgreSQL (Supabase)

Authentication

Supabase Auth

Validation

Zod

Payments

Razorpay

Video

LiveKit

Email

Resend

Storage

Supabase Storage

---

# 3. Backend Philosophy

The backend must be:

* Modular
* Feature-first
* Transaction-safe
* Strongly typed
* Secure by default

Business logic never belongs inside UI or database queries.

---

# 4. Layered Architecture

```text
UI

↓

Server Action

↓

Service

↓

Repository

↓

Supabase Client

↓

PostgreSQL
```

Every request flows through these layers.

---

# 5. Folder Structure

```text
features/

booking/

actions/

services/

repositories/

schemas/

types/

constants/

payments/

therapists/

notifications/

reviews/

admin/
```

No feature accesses another feature's repository directly.

---

# 6. Server Actions

Responsibilities

* Authentication
* Authorization
* Input validation
* Calling services
* Returning responses

Server Actions must remain thin.

---

# 7. Service Layer

Contains business rules.

Examples

BookingService

PaymentService

TherapistService

NotificationService

ReviewService

Responsibilities

* Business logic
* Transactions
* Validation beyond schema rules
* Calling side effects (notifications, video session creation)

---

# 8. Repository Layer

Responsibilities

* Database queries
* CRUD operations
* Mapping database models

Repositories never contain business logic.

---

# 9. Validation

Every request validated with Zod.

Validation stages

Client

↓

Server Action

↓

Service

↓

Database Constraints

Never trust client input.

---

# 10. Transactions

Use transactions for operations that modify multiple entities.

Examples

Booking + Payment

Refund + Appointment Update

Therapist Approval + Notification

If one step fails, the entire operation must roll back where supported.

---

# 11. Event Flow

When an appointment is created or a payment succeeds, the service layer should perform related side effects inline (within the same server action):

Example: Booking Confirmed

1. Update appointment status to `confirmed`
2. Create video session record
3. Insert notification record
4. Send confirmation email via Resend

Keep it simple — call these sequentially in the service. No event bus or message queue needed for MVP.

If an email fails to send, log the error but do not roll back the appointment. Email delivery is best-effort.

---

# 12. Error Handling

Use typed application errors.

Examples

ValidationError

AuthorizationError

BookingConflictError

PaymentVerificationError

ResourceNotFoundError

Never expose internal stack traces.

---

# 13. Logging

Log

Authentication failures

Payments

Refunds

Bookings

Verification decisions

Unexpected exceptions

Never log sensitive healthcare information.

---

# 14. File Uploads

Store files in Supabase Storage.

Validate

File type

File size

Ownership

Virus scanning can be added in future.

---

# 15. Security

RLS enabled.

JWT validated.

Service role restricted.

Secrets remain server-side.

Rate limiting applied to sensitive actions.

---

# 16. Dependency Rules

Allowed

Server Action → Service

Service → Repository

Repository → Database

Forbidden

Repository → UI

Repository → Repository (cross-feature)

UI → Repository

Service → UI

---

# 17. Background Jobs

For MVP, there are no background job workers.

Appointment reminders: Use Supabase `pg_cron` extension or a simple Vercel Cron (vercel.json) to run a reminder function once per hour that queries upcoming appointments and sends emails.

Email sending: Done inline in services via Resend. If it fails, log the error.

Expired slot lock cleanup: Not strictly required (queries filter by `expires_at > now()`), but a daily cron can clean up old rows if desired.

Future enhancements (not MVP):
- Dedicated queue for notifications
- Retry logic for failed emails
- Webhook retry processing

Jobs should be idempotent.

---

# 18. Caching

For MVP, no caching infrastructure is needed.

Next.js built-in caching (ISR, fetch cache) is sufficient:
- Blog pages: ISR with revalidation every hour
- Therapist listing: revalidate on demand (after profile update)
- Static pages (About, FAQ, etc.): Static generation

Do not cache:
- Authentication state
- Appointments
- Payments
- Private profile data

Future: If performance becomes an issue, add Redis or Vercel KV. Not needed for MVP.

---

# 19. Performance

Use Server Components by default (reduces client JS).

Paginate lists (appointments, therapists, reviews) — 10-20 items per page.

Use proper indexes (already defined in schema docs).

Avoid N+1 queries — use JOINs or batch fetches in repositories.

Optimize images with Next.js `<Image>` component.

---

# 20. Kiro Implementation Rules

* Generate one feature at a time.
* Build repositories before services.
* Keep Server Actions minimal.
* Never bypass the service layer.
* Use transactions for multi-step operations.
* Follow the documented folder structure.
* Maintain strict TypeScript typing throughout the backend.

---

# 21. Acceptance Criteria

The backend architecture is complete when:

* Every request follows the defined layers.
* Business logic is isolated in services.
* Database access is centralized in repositories.
* Validation is enforced at the Server Action and service layers.
* Transactions protect critical workflows (booking + payment).
* Logging, security, and performance standards are applied.

---

# End of Document
