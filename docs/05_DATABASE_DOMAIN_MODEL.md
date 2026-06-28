# 05_DATABASE_DOMAIN_MODEL.md

# TalkIndia

## Database Domain Model

Version: 1.0

Dependencies

* 00_PROJECT_OVERVIEW.md
* 01_PRODUCT_REQUIREMENTS.md
* 02_USER_FLOWS.md
* 03_INFORMATION_ARCHITECTURE.md
* 04_SYSTEM_ARCHITECTURE.md

---

# 1. Purpose

This document defines the business entities (domain model) used throughout TalkIndia.

It does **not** define database tables or SQL.

It defines:

* Business objects
* Ownership
* Relationships
* Lifecycle
* Business rules

The physical database schema will be derived from this document.

---

# 2. Domain Overview

Core Entities

```
User
│
├── Patient
├── Therapist
└── Admin

Therapist
│
├── Availability
├── Appointment
├── Review
└── Verification

Patient
│
├── Appointment
├── Payment
├── Review
└── Notification

Appointment
│
├── Payment
├── Video Session
├── Invoice
└── Review
```

---

# 3. User

Purpose

Represents every authenticated account.

Possible Roles

* Patient
* Therapist
* Admin

Responsibilities

* Authentication
* Authorization
* Identity

Lifecycle

Created

↓

Verified

↓

Active

↓

Suspended

↓

Deleted

Business Rules

Every account has exactly one role.

A user cannot simultaneously be both Patient and Therapist in Version 1.

---

# 4. Patient

Purpose

Represents a healthcare seeker.

Owns

* Appointments
* Reviews
* Notifications

Can

* Book
* Cancel
* Reschedule
* Review

Cannot

* Manage therapist availability
* Verify therapists

Lifecycle

Registered

↓

Verified

↓

Active

↓

Inactive

---

# 5. Therapist

Purpose

Represents a licensed mental healthcare professional.

Owns

* Availability
* Schedule
* Appointments
* Earnings

Can

* Edit profile
* Configure calendar
* Conduct consultations
* View appointment history
* View earnings

Cannot

* Approve themselves
* Access another therapist's data

Lifecycle

Registered

↓

Documents Uploaded

↓

Pending Verification

↓

Approved

↓

Active

↓

Suspended

---

# 6. Administrator

Purpose

Operates the marketplace.

Responsibilities

* Verify therapists
* Manage users
* Process refunds
* Moderate content
* Resolve disputes

Administrators own no business data.

They administer platform data.

---

# 7. Therapist Verification

Purpose

Tracks professional verification.

States

Draft

↓

Submitted

↓

Pending

↓

Approved

↓

Rejected

↓

Expired

Rules

Only approved therapists appear in search.

Rejected therapists may resubmit.

---

# 8. Availability

Purpose

Defines therapist working schedule.

Contains

* Working days
* Start time
* End time
* Breaks
* Holidays
* Buffer

Business Rules

Availability cannot overlap.

Unavailable periods override recurring schedules.

Booked slots become unavailable.

---

# 9. Appointment

Purpose

Represents a consultation.

Owned By

Patient

Assigned To

Therapist

Contains

* Date
* Time
* Duration
* Status
* Consultation Type

Lifecycle

Payment Pending

↓

Confirmed

↓

Completed

Alternative States

Cancelled

Rescheduled

No Show

Refunded

Business Rules

Appointments cannot exist without:

Patient

Therapist

Scheduled time

Appointments require payment confirmation (Razorpay webhook).

---

# 10. Payment

Purpose

Tracks financial transactions.

Types

Appointment Payment

Refund

Future

Subscription

Fields

Amount

Status

Gateway

Reference

Business Rules

Appointments become confirmed only after successful payment verification.

---

# 11. Invoice

Purpose

Represents proof of payment.

Generated

After successful payment.

Contains

Invoice Number

Patient

Therapist

Amount

Taxes

Date

Download Link

Invoices are immutable.

---

# 12. Video Session

Purpose

Represents an online consultation.

Linked To

Appointment

Contains

Meeting ID

Join URL

Host URL

Duration

Status

Lifecycle

Created

↓

Scheduled

↓

Active

↓

Ended

↓

Archived

Meeting links expire automatically.

---

# 13. Review

Purpose

Collect patient feedback.

Owned By

Patient

Associated With

Appointment

Therapist

Contains

Rating

Comment

Date

Rules

One review per completed appointment.

---

# 14. Notification

Purpose

Deliver important updates to users.

Recipients

Patient

Therapist

Channels (MVP)

Dashboard (in-app)

Email (via Resend)

Events that create notifications:

* Booking confirmed
* Booking cancelled
* Appointment reminder
* Payment successful
* Therapist verification update

Notifications are created inline by the service layer. No queue system needed for MVP.

---

# 15. Blog Article

Purpose

Improve SEO.

Contains

Title

Slug

Author

Content

Category

Status

Published Date

Only admins publish articles.

---

# 16. Support Ticket

Purpose

Customer support.

Created By

Patient

Therapist

Assigned To

Admin

Lifecycle

Open

↓

Assigned

↓

Resolved

↓

Closed

---

# 17. Relationship Summary

User

↓

Patient

↓

Appointments

↓

Payment

↓

Invoice

↓

Review

Therapist

↓

Availability

↓

Appointments

↓

Verification

↓

Reviews

Admin

↓

Verification

↓

Support

↓

Moderation

---

# 18. Business Rules

* A therapist must be approved before receiving bookings.
* An appointment belongs to exactly one patient.
* An appointment belongs to exactly one therapist.
* A payment belongs to one appointment.
* A review belongs to one completed appointment.
* Availability cannot overlap.
* Invoices cannot be edited after generation.
* Notifications are immutable once delivered.

---

# 19. Ownership Matrix

Patient owns:

* Profile
* Appointments
* Reviews

Therapist owns:

* Profile
* Availability
* Schedule

Admin owns:

* Platform configuration
* Verification
* CMS
* Support operations

---

# 20. Future Domain Entities (Not in V1)

* Subscription
* AI Conversation
* Journal
* Mood Entry
* Insurance Policy
* Corporate Account
* Activity Logs (per-user analytics)
* Notification Queue / Delivery Tracking
* Feature Flags
* Media Library (separate metadata table)

These entities must not affect Version 1 database design.

---

# 21. Acceptance Criteria

The domain model is complete when:

* Every business object has a defined purpose.
* Every entity has an owner.
* Every entity has a lifecycle.
* Relationships are defined.
* Business rules are documented.
* Future entities do not introduce ambiguity.

---

# 22. Kiro Implementation Rules

Treat these entities as the canonical business model.

Do not create additional entities without updating this document.

The SQL schema, Supabase tables, RLS policies, repositories, services, and APIs must all be derived from this domain model.

Business rules defined here take precedence over implementation assumptions.

---

# End of Document
