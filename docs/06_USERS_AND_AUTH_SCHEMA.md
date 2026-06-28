# 06.01_USERS_AND_AUTH_SCHEMA.md

# TalkIndia

## Database Schema Specification

### Part 1 - Authentication, Users & Profiles

Version: 1.0

Dependencies

* 05_DATABASE_DOMAIN_MODEL.md

---

# Purpose

This document defines the database schema responsible for:

* Authentication
* User Profiles
* Roles
* Therapist Profiles
* Verification
* Supporting lookup tables

Supabase Authentication is the source of truth for user identity.

Application-specific data is stored separately.

---

# Database Overview

Authentication

```text
auth.users
```

Application Tables

```text
profiles

roles

therapist_profiles

therapist_verifications

specializations

languages

therapist_specializations

therapist_languages
```

---

# Naming Convention

Tables

snake_case

Columns

snake_case

Primary Key

id

Foreign Key

<referenced_table>_id

Timestamps

created_at

updated_at

Soft Delete

deleted_at

UUID

Every primary key must use UUID.

---

# Table

## profiles

Purpose

Stores application profile information.

Authentication remains inside

auth.users

---

Columns

| Column         | Type        | Required      | Description                |
| -------------- | ----------- | ------------- | -------------------------- |
| id             | uuid PK     | Yes           | Same UUID as auth.users.id |
| role_id        | uuid FK     | Yes           | User role                  |
| full_name      | text        | Yes           | Display name               |
| email          | text        | Yes           | Cached email               |
| phone          | text        | Yes           | Mobile number              |
| avatar_url     | text        | No            | Profile image              |
| gender         | text        | No            | Gender                     |
| date_of_birth  | date        | No            | DOB                        |
| city           | text        | No            | City                       |
| state          | text        | No            | State                      |
| country        | text        | Default India | Country                    |
| emergency_contact | text     | No            | Emergency contact number   |
| is_active      | boolean     | Default true  | Account active             |
| email_verified | boolean     | Default false | Email status               |
| phone_verified | boolean     | Default false | Phone status               |
| created_at     | timestamptz | Yes           | Created                    |
| updated_at     | timestamptz | Yes           | Updated                    |
| deleted_at     | timestamptz | Nullable      | Soft delete                |

---

Relationships

```text
auth.users

↓

profiles

↓

therapist_profiles

↓

appointments
```

---

Indexes

```text
email

phone

role_id
```

---

Constraints

Phone unique

Email unique

Country default India

---

Business Rules

Every authenticated user must have exactly one profile.

Deleting auth.users should cascade appropriately according to your deletion strategy.

---

# Table

## roles

Purpose

Defines platform roles.

Columns

| Column      | Type        |
| ----------- | ----------- |
| id          | uuid PK     |
| name        | text        |
| description | text        |
| created_at  | timestamptz |

Seed Values

Patient

Therapist

Admin

Future

Moderator

Support

---

Unique Constraint

Role name unique.

---

# Table

## therapist_profiles

Purpose

Stores therapist-specific information.

Only users with Therapist role may have a record.

Columns

| Column              | Type        |
| ------------------- | ----------- |
| id                  | uuid PK     |
| profile_id          | uuid FK     |
| professional_title  | text        |
| license_number      | text        |
| years_experience    | integer     |
| consultation_fee    | numeric     |
| biography           | text        |
| consultation_mode   | text        |
| average_rating      | numeric     |
| total_reviews       | integer     |
| total_sessions      | integer     |
| is_featured         | boolean     |
| verification_status | text        |
| created_at          | timestamptz |
| updated_at          | timestamptz |

---

Indexes

```text
profile_id

license_number

verification_status

consultation_fee

average_rating
```

---

Business Rules

License number unique.

Consultation fee greater than zero.

Only verified therapists appear publicly.

Average rating computed automatically.

---

# Table

## therapist_verifications

Purpose

Stores verification requests.

Columns

| Column                 | Type        |
| ---------------------- | ----------- |
| id                     | uuid PK     |
| therapist_profile_id   | uuid FK     |
| government_id_url      | text        |
| degree_certificate_url | text        |
| license_document_url   | text        |
| selfie_photo_url       | text        |
| verification_status    | text        |
| rejection_reason       | text        |
| reviewed_by            | uuid FK     |
| reviewed_at            | timestamptz |
| submitted_at           | timestamptz |
| created_at             | timestamptz |

---

Statuses

Draft

Submitted

Pending

Approved

Rejected

Expired

---

Rules

Only admins can approve.

Rejected applications remain in history.

Therapists may resubmit.

---

# Table

## specializations

Purpose

Master table.

Examples

Anxiety

Depression

Couples Therapy

ADHD

OCD

Trauma

Family Therapy

Child Psychology

Columns

| Column      | Type        |
| ----------- | ----------- |
| id          | uuid PK     |
| name        | text        |
| slug        | text        |
| description | text        |
| created_at  | timestamptz |

Unique

Slug

Name

---

# Table

## therapist_specializations

Purpose

Many-to-many relationship.

Columns

| Column               | Type    |
| -------------------- | ------- |
| therapist_profile_id | uuid FK |
| specialization_id    | uuid FK |

Composite Unique

```text
therapist_profile_id

specialization_id
```

---

# Table

## languages

Purpose

Master language table.

Examples

English

Hindi

Punjabi

Tamil

Bengali

Marathi

Gujarati

Kannada

Malayalam

Telugu

Columns

| Column | Type    |
| ------ | ------- |
| id     | uuid PK |
| name   | text    |
| code   | text    |

Unique

Language code.

---

# Table

## therapist_languages

Purpose

Many-to-many mapping.

Columns

| Column               | Type    |
| -------------------- | ------- |
| therapist_profile_id | uuid FK |
| language_id          | uuid FK |

Composite Unique

```text
therapist_profile_id

language_id
```

---

# Recommended PostgreSQL Enums

Role

```text
patient

therapist

admin
```

Verification Status

```text
draft

submitted

pending

approved

rejected

expired
```

Consultation Mode

```text
online

offline

both
```

Gender

```text
male

female

other

prefer_not_to_say
```

---

# Required Indexes

profiles.email

profiles.phone

profiles.role_id

therapist_profiles.license_number

therapist_profiles.verification_status

therapist_profiles.consultation_fee

specializations.slug

languages.code

---

# RLS Requirements

Profiles

Users may read and update only their own profile.

Therapist Profiles

Public can read only verified therapist profiles.

Therapists may edit only their own profile.

Admins have full access.

Verification

Only admins can review or modify verification records.

Lookup Tables

Public read-only.

Admins manage content.

---

# Migration Order

1. roles

2. profiles

3. therapist_profiles

4. therapist_verifications

5. specializations

6. languages

7. therapist_specializations

8. therapist_languages

---

# Acceptance Criteria

* Authentication handled exclusively by Supabase Auth.
* Every authenticated user has exactly one profile.
* Every therapist has exactly one therapist profile.
* Only verified therapists are publicly searchable.
* Many-to-many relationships work correctly.
* RLS prevents unauthorized access.
* Lookup tables are normalized.

---

# Kiro Implementation Notes

* Never create a duplicate authentication table.
* Reference `auth.users.id` as the identity source.
* Use UUIDs everywhere.
* Generate migrations incrementally.
* Seed `roles`, `specializations`, and `languages`.
* Create RLS policies immediately after table creation.
* Add indexes before importing production data.

---

# End of Document part 1


# 06.02_APPOINTMENTS_AND_BOOKINGS_SCHEMA.md

# TalkIndia

## Database Schema Specification

### Part 2 - Booking & Appointment System

Version: 1.0

Dependencies

* 06.01_USERS_AND_AUTH_SCHEMA.md

---

# Purpose

Defines every database entity required for:

* Therapist availability
* Booking engine
* Calendar
* Appointments
* Rescheduling
* Cancellation
* Appointment lifecycle

This is the core business module.

---

# Booking Architecture

```text
Therapist

↓

Availability Rules

↓

Blocked Periods

↓

Available Slots (Generated)

↓

Appointment

↓

Video Session

↓

Completed
```

Slots are **generated dynamically**.

No permanent slot table exists.

---

# Table

## therapist_availability

Purpose

Defines recurring weekly schedule.

Example

Monday

09:00 → 13:00

15:00 → 18:00

Columns

| Column                | Type        |
| --------------------- | ----------- |
| id                    | uuid PK     |
| therapist_profile_id  | uuid FK     |
| weekday               | smallint    |
| start_time            | time        |
| end_time              | time        |
| slot_duration_minutes | integer     |
| break_after_minutes   | integer     |
| buffer_before_minutes | integer     |
| buffer_after_minutes  | integer     |
| is_active             | boolean     |
| created_at            | timestamptz |
| updated_at            | timestamptz |

---

Rules

Weekday

0–6

End time must be greater than start time.

Slot duration

15

30

45

60

90

120

No overlapping schedules.

---

Indexes

```text
therapist_profile_id

weekday
```

---

# Table

## therapist_blocked_periods

Purpose

Stores holidays and unavailable periods.

Examples

Vacation

Conference

Emergency Leave

Columns

| Column               | Type        |
| -------------------- | ----------- |
| id                   | uuid PK     |
| therapist_profile_id | uuid FK     |
| start_datetime       | timestamptz |
| end_datetime         | timestamptz |
| reason               | text        |
| created_at           | timestamptz |

---

Rules

Blocked periods override availability.

Cannot overlap existing blocked periods.

---

# Table

## appointments

Purpose

Represents a confirmed or pending consultation.

Columns

| Column               | Type               |
| -------------------- | ------------------ |
| id                   | uuid PK            |
| patient_profile_id   | uuid FK            |
| therapist_profile_id | uuid FK            |
| appointment_date     | date               |
| start_time           | time               |
| end_time             | time               |
| duration_minutes     | integer            |
| consultation_mode    | consultation_mode  |
| status               | appointment_status |
| booking_reference    | text               |
| notes                | text               |
| created_at           | timestamptz        |
| updated_at           | timestamptz        |
| cancelled_at         | timestamptz        |
| completed_at         | timestamptz        |

---

Business Rules

One patient.

One therapist.

One slot.

One appointment.

Note on Foreign Keys:
- `patient_profile_id` references `profiles.id` (the patient's profile UUID, same as `auth.users.id`).
- `therapist_profile_id` references `therapist_profiles.id`.

---

Unique Constraint

```text
therapist_profile_id

appointment_date

start_time
```

This prevents double booking.

---

Indexes

```text
patient_profile_id

therapist_profile_id

appointment_date

status

created_at
```

---

# Appointment Status Enum

```text
payment_pending

confirmed

cancelled

rescheduled

completed

no_show

refunded
```

---

# Table

## appointment_status_history

Purpose

Stores every status transition.

Columns

| Column         | Type               |
| -------------- | ------------------ |
| id             | uuid PK            |
| appointment_id | uuid FK            |
| old_status     | appointment_status |
| new_status     | appointment_status |
| changed_by     | uuid FK            |
| reason         | text               |
| changed_at     | timestamptz        |

---

Example

Confirmed

↓

Cancelled

↓

Refunded

↓

Archived

Entire history remains available.

---

# Table

## appointment_reschedules

Purpose

Stores reschedule history.

Columns

| Column         | Type        |
| -------------- | ----------- |
| id             | uuid PK     |
| appointment_id | uuid FK     |
| old_date       | date        |
| old_start_time | time        |
| new_date       | date        |
| new_start_time | time        |
| rescheduled_by | uuid FK     |
| reason         | text        |
| created_at     | timestamptz |

---

Rules

History cannot be deleted.

Maximum reschedules configurable.

---

# Table

## appointment_cancellations

Purpose

Audit cancellation events.

Columns

| Column              | Type        |
| ------------------- | ----------- |
| id                  | uuid PK     |
| appointment_id      | uuid FK     |
| cancelled_by        | uuid FK     |
| cancellation_reason | text        |
| refund_required     | boolean     |
| created_at          | timestamptz |

---

Rules

Every cancellation recorded.

Cannot modify after creation.

---

# Booking Algorithm

Patient selects slot

↓

Generate availability

↓

Check blocked periods

↓

Check existing appointments

↓

Lock slot

↓

Payment

↓

Create appointment

↓

Unlock remaining availability

---

# Temporary Slot Lock

Slot locks prevent double-booking during the payment window.

Implementation: a simple `slot_locks` table with automatic expiry.

# Table

## slot_locks

Purpose

Temporarily reserves a slot while the patient completes payment.

Columns

| Column               | Type        |
| -------------------- | ----------- |
| id                   | uuid PK     |
| therapist_profile_id | uuid FK     |
| patient_id           | uuid FK     |
| appointment_date     | date        |
| start_time           | time        |
| locked_at            | timestamptz |
| expires_at           | timestamptz |

Rules

Lock duration: 5 minutes (configurable in `platform_settings`).

The booking service checks `slot_locks` when generating available slots.

Expired locks are ignored (treated as available).

A cron or application-level cleanup can delete expired rows periodically, but is not strictly required since the query filters by `expires_at > now()`.

Unique Constraint

```text
therapist_profile_id
appointment_date
start_time
```

This ensures only one patient can lock a given slot at a time.

---

# Constraints

Appointment duration > 0

End time > start time

Appointment cannot be created in the past.

Cancelled appointments release availability.

---

# PostgreSQL Enums

appointment_status

```text
payment_pending

confirmed

cancelled

completed

rescheduled

no_show

refunded
```

weekday

```text
0

1

2

3

4

5

6
```

---

# RLS Policies

Patients

Read own appointments.

Therapists

Read assigned appointments.

Admins

Read everything.

Patients cannot update completed appointments.

---

# Migration Order

1

therapist_availability

2

therapist_blocked_periods

3

appointments

4

appointment_status_history

5

appointment_reschedules

6

appointment_cancellations

---

# Performance

Indexes

therapist_profile_id

appointment_date

status

Composite Index

```text
therapist_profile_id

appointment_date

start_time
```

Use EXCLUDE constraints (PostgreSQL) if later supporting variable-length overlapping bookings.

---

# Acceptance Criteria

* Double booking impossible.
* Availability generated dynamically.
* Holidays respected.
* Appointment history preserved.
* Status transitions audited.
* Reschedule history maintained.
* Cancellations audited.
* RLS enforced.

---

# Table

## reviews

Purpose

Stores patient feedback for completed appointments.

Columns

| Column               | Type        |
| -------------------- | ----------- |
| id                   | uuid PK     |
| appointment_id       | uuid FK     |
| patient_profile_id   | uuid FK     |
| therapist_profile_id | uuid FK     |
| rating               | smallint    |
| comment              | text        |
| created_at           | timestamptz |
| updated_at           | timestamptz |

Rules

One review per appointment (unique constraint on `appointment_id`).

Rating must be between 1 and 5.

Only completed appointments may be reviewed.

Reviews are editable within 24 hours of creation.

After 24 hours, reviews become read-only.

Indexes

```text
appointment_id (unique)
therapist_profile_id
patient_profile_id
created_at
```

---

# Kiro Implementation Notes

* Never generate permanent slot rows.
* Compute availability from rules + blocked periods + existing appointments.
* Wrap booking creation and payment confirmation in a transaction where appropriate.
* Apply unique constraints before enabling bookings.
* Keep booking logic in a dedicated BookingService, not in React components.
* After a review is created, update `therapist_profiles.average_rating` and `therapist_profiles.total_reviews` using a simple service-layer calculation.

---

# End of Document


# 06.03_PAYMENTS_AND_BILLING_SCHEMA.md

# TalkIndia

## Database Schema Specification

### Part 3 - Payments, Billing & Financial Records

Version: 1.0

Dependencies

* 06.02_APPOINTMENTS_AND_BOOKINGS_SCHEMA.md

---

# Purpose

Defines the complete payment architecture.

This module handles:

* Payment Attempts
* Successful Payments
* Refunds
* Invoices
* Coupons
* Gateway Events

Financial records must be immutable.

Never delete financial data.

---

# Payment Architecture

```text
Appointment

↓

Payment Attempt

↓

Gateway

↓

Success / Failure

↓

Payment Record

↓

Invoice

↓

Refund (Optional)
```

Every financial action is recorded.

---

# Table

## payment_attempts

Purpose

Tracks every payment initiation.

A user may retry payment multiple times.

Columns

| Column             | Type                   |
| ------------------ | ---------------------- |
| id                 | uuid PK                |
| appointment_id     | uuid FK                |
| patient_profile_id | uuid FK                |
| amount             | numeric(10,2)          |
| currency           | text                   |
| gateway            | text                   |
| gateway_order_id   | text                   |
| status             | payment_attempt_status |
| created_at         | timestamptz            |
| expires_at         | timestamptz            |

---

Statuses

pending

processing

failed

expired

completed

---

Rules

Each retry creates a new attempt.

Attempts never overwritten.

---

# Table

## payments

Purpose

Represents verified successful payments.

Columns

| Column               | Type           |
| -------------------- | -------------- |
| id                   | uuid PK        |
| appointment_id       | uuid FK        |
| payment_attempt_id   | uuid FK        |
| patient_profile_id   | uuid FK        |
| therapist_profile_id | uuid FK        |
| amount               | numeric(10,2)  |
| currency             | text           |
| payment_method       | payment_method |
| gateway              | text           |
| gateway_payment_id   | text           |
| gateway_order_id     | text           |
| gateway_signature    | text           |
| status               | payment_status |
| paid_at              | timestamptz    |
| created_at           | timestamptz    |

---

Rules

Only gateway-verified payments create records.

Never trust client confirmation.

Webhook verification required.

---

Unique Constraints

gateway_payment_id

gateway_order_id

---

Indexes

appointment_id

patient_profile_id

therapist_profile_id

paid_at

status

---

# Payment Status Enum

```text
successful

partially_refunded

fully_refunded

disputed
```

---

# Payment Method Enum

```text
upi

credit_card

debit_card

net_banking

wallet

emi
```

---

# Table

## invoices

Purpose

Stores generated invoices.

Columns

| Column          | Type        |
| --------------- | ----------- |
| id              | uuid PK     |
| payment_id      | uuid FK     |
| invoice_number  | text        |
| subtotal        | numeric     |
| tax_amount      | numeric     |
| discount_amount | numeric     |
| total_amount    | numeric     |
| invoice_pdf_url | text        |
| generated_at    | timestamptz |

---

Rules

Generated after successful payment.

Invoice number immutable.

Invoice cannot be edited.

---

Unique

invoice_number

---

# Table

## refunds

Purpose

Tracks refund transactions.

Columns

| Column            | Type          |
| ----------------- | ------------- |
| id                | uuid PK       |
| payment_id        | uuid FK       |
| appointment_id    | uuid FK       |
| amount            | numeric       |
| reason            | text          |
| gateway_refund_id | text          |
| refund_status     | refund_status |
| processed_by      | uuid FK       |
| refunded_at       | timestamptz   |
| created_at        | timestamptz   |

---

Refund Status

```text
pending

processing

completed

failed
```

---

Rules

Multiple partial refunds allowed.

Total refunded amount must never exceed payment amount.

---

# Table

## coupons

Purpose

Marketing discounts.

Columns

| Column               | Type          |
| -------------------- | ------------- |
| id                   | uuid PK       |
| code                 | text          |
| description          | text          |
| discount_type        | discount_type |
| discount_value       | numeric       |
| minimum_order_amount | numeric       |
| maximum_discount     | numeric       |
| usage_limit          | integer       |
| used_count           | integer       |
| starts_at            | timestamptz   |
| expires_at           | timestamptz   |
| is_active            | boolean       |

---

Discount Types

```text
percentage

fixed
```

---

Rules

Coupon code unique.

Expired coupons rejected.

Usage limit enforced.

---

# Table

## coupon_redemptions

Purpose

Tracks coupon usage.

Columns

| Column             | Type        |
| ------------------ | ----------- |
| id                 | uuid PK     |
| coupon_id          | uuid FK     |
| patient_profile_id | uuid FK     |
| payment_attempt_id | uuid FK     |
| discount_amount    | numeric     |
| created_at         | timestamptz |

---

Rules

Audit every redemption.

---

# Table

## payment_webhook_events

Purpose

Stores gateway webhooks.

Columns

| Column           | Type        |
| ---------------- | ----------- |
| id               | uuid PK     |
| gateway          | text        |
| event_name       | text        |
| gateway_event_id | text        |
| payload          | jsonb       |
| processed        | boolean     |
| received_at      | timestamptz |

---

Rules

Never delete webhook payloads.

Prevent duplicate processing.

---

# Financial Flow

Patient

↓

Payment Attempt

↓

Gateway

↓

Webhook

↓

Verification

↓

Payment Record

↓

Invoice

↓

Appointment Confirmed

---

# Constraints

Payment amount > 0.

Refund <= Payment.

One invoice per successful payment.

Gateway IDs unique.

---

# Index Strategy

payments

appointment_id

patient_profile_id

therapist_profile_id

status

paid_at

refunds

payment_id

coupon_redemptions

coupon_id

patient_profile_id

payment_webhook_events

gateway_event_id

processed

---

# RLS

Patients

View own payments.

Therapists

View payments related to their appointments.

Admins

Full access.

Webhooks

Server-only.

---

# Migration Order

1. payment_attempts

2. payments

3. invoices

4. refunds

5. coupons

6. coupon_redemptions

7. payment_webhook_events

---

# Acceptance Criteria

* Payment retries supported.
* Duplicate gateway events ignored.
* Successful payments verified.
* Refunds fully auditable.
* Invoices immutable.
* Coupons validated.
* Financial history preserved.

---

# Kiro Implementation Notes

* Verify gateway signatures server-side before creating a payment.
* Never update financial records destructively; append new records where appropriate.
* Handle webhooks idempotently.
* Keep payment logic isolated in a PaymentService.
* Do not expose service-role credentials to the client.
* Record all monetary values with fixed precision (`numeric`), not floating-point types.

---

# End of Document

# 06.04_VIDEO_CONSULTATION_AND_NOTIFICATIONS_SCHEMA.md

# TalkIndia

## Database Schema Specification

### Part 4 – Video Consultation & Notification System

Version: 1.0

Dependencies

* 06.02_APPOINTMENTS_AND_BOOKINGS_SCHEMA.md
* 06.03_PAYMENTS_AND_BILLING_SCHEMA.md

---

# Purpose

This document defines:

* Video consultation sessions
* Meeting lifecycle
* Session attendance
* Notification system
* Notification templates
* Delivery logs
* Reminder scheduling

---

# Architecture

```text
Appointment

↓

Video Session

↓

Meeting Events

↓

Attendance

↓

Notifications

↓

Delivery Logs
```

---

# Table

## video_sessions

Purpose

Stores online consultation session details.

Columns

| Column           | Type                 |
| ---------------- | -------------------- |
| id               | uuid PK              |
| appointment_id   | uuid FK              |
| provider         | text                 |
| room_id          | text                 |
| meeting_url      | text                 |
| host_url         | text                 |
| meeting_password | text                 |
| status           | video_session_status |
| scheduled_start  | timestamptz          |
| scheduled_end    | timestamptz          |
| actual_start     | timestamptz          |
| actual_end       | timestamptz          |
| created_at       | timestamptz          |

---

Rules

One appointment has one video session.

Meeting created only after successful payment.

Meeting automatically expires after completion.

---

Video Session Status

```text
scheduled

waiting

live

completed

cancelled

expired
```

---

Indexes

appointment_id

status

scheduled_start

---

# Table

## session_attendance

Purpose

Track who joined the consultation.

Columns

| Column           | Type             |
| ---------------- | ---------------- |
| id               | uuid PK          |
| video_session_id | uuid FK          |
| participant_role | participant_role |
| user_id          | uuid FK          |
| joined_at        | timestamptz      |
| left_at          | timestamptz      |
| duration_seconds | integer          |

---

Participant Roles

```text
patient

therapist
```

---

Rules

Attendance history is immutable.

---

# Video Session Events (Future Enhancement)

For MVP, video session events are NOT tracked in a separate table.
The `session_attendance` table provides sufficient audit (who joined, when, duration).

If detailed event tracking is needed later, add a `video_session_events` table.

---

# Notification Architecture

For MVP, notifications are sent inline by the service layer:

1. Insert row into `notifications` table (for dashboard display).
2. Call Resend API to send email (best-effort).

No queue, no templates table, no delivery tracking.

```text
Service Action

↓

Notification

↓

Delivery Queue

↓

Email

↓

SMS (Future)

↓

Push (Future)

↓

Dashboard
```

---

# Table

## notifications

Purpose

Stores notifications visible to users.

Columns

| Column            | Type              |
| ----------------- | ----------------- |
| id                | uuid PK           |
| user_id           | uuid FK           |
| title             | text              |
| message           | text              |
| notification_type | notification_type |
| reference_type    | text              |
| reference_id      | uuid              |
| is_read           | boolean           |
| read_at           | timestamptz       |
| created_at        | timestamptz       |

---

Notification Types

```text
appointment

payment

refund

verification

review

system

marketing
```

---

Indexes

user_id

is_read

created_at

---

# Table

## notification_templates

Purpose

Stores reusable templates.

Columns

| Column     | Type                 |
| ---------- | -------------------- |
| id         | uuid PK              |
| name       | text                 |
| channel    | notification_channel |
| subject    | text                 |
| body       | text                 |
| is_active  | boolean              |
| created_at | timestamptz          |

---

Notification Channels (MVP)

```text
dashboard

email
```

Future: sms, push, whatsapp

---

# Reminder Schedule (MVP)

For MVP, use a Vercel Cron job (runs hourly) that:
1. Queries appointments starting within the next hour
2. Sends reminder emails via Resend
3. Inserts a dashboard notification

Full schedule (implement as time permits):
- 24 hours before → email
- 1 hour before → email + dashboard notification

---

# Tables NOT needed for MVP

The following tables are documented here for future reference but should NOT be created for the initial build:

- `notification_templates` — hardcode email templates in the service layer
- `notification_queue` — send notifications inline, no queue needed
- `notification_delivery_logs` — not needed for MVP

---

# Constraints

Notification must belong to one user.

Attendance duration cannot be negative.

Meeting end must be after start.

---

# RLS

Patients

Read own notifications.

Therapists

Read own notifications.

Admins

Read all.

---

# Migration Order

1. video_sessions

2. session_attendance

3. notifications

---

# Acceptance Criteria

* Video sessions linked to appointments.
* Attendance tracked.
* Notifications stored and displayed in dashboard.
* Reminder emails sent before appointments.

---

# Kiro Implementation Notes

* Generate video sessions only after confirmed payment.
* Never expose host URLs to patients.
* Send notifications inline in the service layer (NotificationService).
* Email sending is best-effort — log errors but don't block the main operation.

---

# End of Document

# 06.05_ADMIN_CMS_AUDIT_SCHEMA.md

# TalkIndia

## Database Schema Specification

### Part 5 - Admin, CMS, Audit & Platform Management

Version: 1.0

Dependencies

* 06.01_USERS_AND_AUTH_SCHEMA.md
* 06.02_APPOINTMENTS_AND_BOOKINGS_SCHEMA.md
* 06.03_PAYMENTS_AND_BILLING_SCHEMA.md
* 06.04_VIDEO_CONSULTATION_AND_NOTIFICATIONS_SCHEMA.md

---

# Purpose

Defines database entities for:

* Administration
* Audit Logs
* Blog CMS
* Media Library
* Support Tickets
* Feature Flags
* Platform Settings
* Activity Logs

This module contains operational data rather than business data.

---

# Architecture

```text
Admin

↓

Platform Settings

↓

CMS

↓

Audit Logs

↓

Support

↓

Media Library
```

---

# Table

## Admin Permissions (Future Enhancement)

For MVP, there is a single admin role with full access. No granular permission system needed.

The `admin_permissions` and `admin_role_permissions` tables are NOT created for MVP.
Admin access is controlled by `is_admin()` function (checks role = 'admin').

If multiple admin roles with different permissions are needed later, add these tables.

---

# Table

## audit_logs

Purpose

Tracks important administrative actions (therapist approval, refunds, etc.).

Columns

| Column        | Type        |
| ------------- | ----------- |
| id            | uuid PK     |
| actor_user_id | uuid FK     |
| action        | text        |
| entity_type   | text        |
| entity_id     | uuid        |
| metadata      | jsonb       |
| created_at    | timestamptz |

---

Examples

Therapist Approved

Therapist Rejected

Refund Processed

Blog Published

---

Rules

Append-only. Never update. Never delete.

---

Indexes

actor_user_id

created_at

---

# Table

## support_tickets

Purpose

Tracks customer support requests.

Columns

| Column      | Type             |
| ----------- | ---------------- |
| id          | uuid PK          |
| created_by  | uuid FK          |
| assigned_to | uuid FK          |
| subject     | text             |
| description | text             |
| priority    | support_priority |
| status      | support_status   |
| created_at  | timestamptz      |
| updated_at  | timestamptz      |
| resolved_at | timestamptz      |

---

Priority Enum

low

medium

high

urgent

---

Status Enum

open

assigned

in_progress

resolved

closed

---

# Table

## support_messages

Purpose

Conversation inside a ticket.

Columns

| Column         | Type        |
| -------------- | ----------- |
| id             | uuid PK     |
| ticket_id      | uuid FK     |
| sender_id      | uuid FK     |
| message        | text        |
| attachment_url | text        |
| created_at     | timestamptz |

---

Rules

Messages immutable.

---

# Table

## blog_categories

Purpose

Organizes blog articles.

Columns

| Column      | Type        |
| ----------- | ----------- |
| id          | uuid PK     |
| name        | text        |
| slug        | text        |
| description | text        |
| created_at  | timestamptz |

---

Unique

Slug

---

# Table

## blog_posts

Purpose

SEO content.

Columns

| Column         | Type        |
| -------------- | ----------- |
| id             | uuid PK     |
| author_id      | uuid FK     |
| category_id    | uuid FK     |
| title          | text        |
| slug           | text        |
| excerpt        | text        |
| content        | text        |
| featured_image | text        |
| status         | blog_status |
| published_at   | timestamptz |
| created_at     | timestamptz |
| updated_at     | timestamptz |

---

Blog Status

draft

review

published

archived

---

Rules

Only published articles are public.

Slug unique.

---

Indexes

slug

status

published_at

---

# Media Library (Not needed for MVP)

For MVP, file uploads go directly to Supabase Storage buckets.
No separate metadata table is needed — Supabase Storage API handles listing and retrieval.

Blog images: stored in `blog-images` bucket, URL saved directly in `blog_posts.featured_image`.
Avatars: stored in `avatars` bucket, URL saved in `profiles.avatar_url`.
Verification docs: stored in `verification-documents` bucket, URLs saved in `therapist_verifications`.

---

# Table

## platform_settings

Purpose

Global application configuration.

Columns

| Column        | Type        |
| ------------- | ----------- |
| id            | uuid PK     |
| setting_key   | text        |
| setting_value | jsonb       |
| description   | text        |
| updated_by    | uuid FK     |
| updated_at    | timestamptz |

---

Examples

Booking Window

Cancellation Policy

Platform Commission

Maximum Reschedules

Maintenance Mode

---

Rules

One row per setting.

---

# Feature Flags (Future Enhancement)

For MVP, feature toggles are NOT needed.
If simple on/off toggles are required, use `platform_settings` table with boolean values.

A dedicated `feature_flags` table can be added later for staged rollouts.

---

# Activity Logs (Future Enhancement)

For MVP, user activity is NOT tracked in a separate table.
The `audit_logs` table covers admin actions, which is sufficient.

If user analytics are needed later, add an `activity_logs` table.

---

# Constraints

Blog slug unique.

Platform setting key unique.

Feature names unique.

Support ticket creator required.

---

# RLS

Audit Logs

Admin only.

Support Tickets

Owner and assigned admin.

Blog Posts

Published visible publicly.

Drafts admin only.

Platform Settings

Admin only.

Feature Flags

Admin only.

Media Library

Owner and admin.

---

# Migration Order

1. admin_permissions

2. admin_role_permissions

3. audit_logs

4. support_tickets

5. support_messages

6. blog_categories

7. blog_posts

8. media_library

9. platform_settings

10. feature_flags

11. activity_logs

---

# Acceptance Criteria

* Every admin action auditable.
* Blog system fully manageable.
* Support conversations persisted.
* Media metadata separated from storage.
* Platform settings configurable.
* Feature flags support staged rollouts.
* Activity history available for diagnostics.

---

# Kiro Implementation Notes

* Never delete audit records.
* Record important state changes through a centralized audit service.
* Keep platform settings cached where appropriate, but treat the database as the source of truth.
* Implement feature flags in a way that allows gradual rollout without redeploying the application.
* Avoid hardcoding business rules (like commission percentage); read them from platform settings where practical.

---

# End of Document

