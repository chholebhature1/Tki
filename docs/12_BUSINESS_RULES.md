# 12_BUSINESS_RULES.md

# TalkIndia

## Business Rules & Platform Policies

Version: 1.0

Dependencies

* 01_PRODUCT_REQUIREMENTS.md
* 05_DATABASE_DOMAIN_MODEL.md
* 07_API_SPECIFICATION.md

---

# 1. Purpose

This document defines all platform-level business rules.

These rules are authoritative.

If implementation differs from this document, the implementation is considered incorrect unless this document is updated.

---

# 2. User Roles

Supported Roles

* Guest
* Patient
* Therapist
* Admin

Rules

* One account has one role.
* Role changes require administrator approval.
* Suspended accounts cannot access protected features.

---

# 3. Patient Rules

Patients can:

* Search therapists
* Book appointments
* Cancel appointments
* Reschedule appointments
* Submit reviews
* Download invoices

Patients cannot:

* View another patient's information.
* Access therapist-only dashboards.
* Modify completed appointments.

---

# 4. Therapist Rules

Therapists can:

* Manage availability
* Conduct consultations
* View earnings
* Update professional profile

Therapists cannot:

* Approve themselves.
* Modify payment records.
* Access another therapist's information.

Note: Bookings are instant after patient payment. Therapists do not manually accept or reject appointments.

---

# 5. Therapist Verification

Required Documents

* Government ID
* Professional License
* Degree Certificate
* Profile Photograph

Rules

* Only approved therapists appear publicly.
* Rejected therapists may resubmit.
* Approval history is permanent.

---

# 6. Booking Rules

Booking Flow:

1. Patient selects a slot → Slot is locked for 5 minutes (DB row).
2. Appointment record created with status `payment_pending`.
3. Patient completes Razorpay payment.
4. Razorpay webhook verifies payment server-side.
5. Appointment status updated to `confirmed`.
6. Video session created, notification sent.

If payment fails or lock expires, the appointment record is deleted and the slot becomes available again.

Appointments require:

* Authenticated patient
* Approved therapist
* Available time slot (not booked or locked)
* Successful payment verification

Appointments cannot:

* Be created in the past.
* Overlap another appointment for the same therapist.
* Be confirmed without server-side payment verification.

---

# 7. Availability Rules

Therapists define:

* Working days
* Working hours
* Breaks
* Holidays
* Slot duration

Rules

* Availability cannot overlap.
* Blocked periods override recurring schedules.
* Booked appointments make slots unavailable.

---

# 8. Cancellation Policy

Patient

Cancellation allowed before the configurable cancellation window.

Default

24 hours before appointment.

Therapist

Cancellation requires a reason.

Admin

May cancel any appointment.

Every cancellation is logged.

---

# 9. Rescheduling Policy

Patients

Maximum configurable number of reschedules.

Default

2 reschedules per appointment.

Therapists

May propose new slots.

Admin

May override limits.

---

# 10. Payment Rules

Payment required before confirmation.

Supported Methods

* UPI
* Credit Card
* Debit Card
* Net Banking
* Wallet
* EMI

Gateway verification is mandatory.

Client-side payment success is never trusted.

---

# 11. Refund Policy

Refund eligibility depends on cancellation timing.

Default

* ≥24 hours before appointment: Full refund.
* <24 hours before appointment: Platform policy applies (configurable).
* Therapist cancellation: Full refund.

Refunds must reference the original payment.

---

# 12. Platform Commission

Commission is configurable.

Default

10%

Formula

```text id="commission"
Platform Earnings

=

Appointment Fee

×

Commission Percentage
```

Therapist payout equals appointment fee minus platform commission.

---

# 13. Coupon Rules

Coupons may have:

* Start date
* Expiry date
* Usage limit
* Minimum order value
* Maximum discount

Expired or exhausted coupons are rejected.

---

# 14. Review Rules

Patients may review only completed appointments.

One review per appointment.

Reviews become read-only after the configurable edit window.

Therapists cannot edit patient reviews.

---

# 15. Video Consultation Rules

Meeting links are created only after confirmed payment.

Patients may join 15 minutes before the scheduled start.

Meeting links expire automatically after the session.

---

# 16. Notification Rules

Events that generate notifications

* Booking confirmed
* Booking cancelled
* Rescheduled
* Payment successful
* Refund processed
* Appointment reminder
* Therapist verification update
* Support ticket update

---

# 17. Invoice Rules

Invoices are generated after successful payment.

Invoices are immutable.

Patients may download invoices at any time.

---

# 18. Support Rules

Users may create support tickets.

Tickets remain associated with the account.

Messages cannot be deleted.

Support history is permanent.

---

# 19. Blog Rules

Only administrators may publish articles.

Draft articles are private.

Published articles are public.

---

# 20. Security Rules

All sensitive operations require:

* Authentication
* Authorization
* Server-side validation
* Audit logging

RLS is mandatory.

---

# 21. Account Suspension

Administrators may suspend:

Patients

Therapists

Reasons may include:

Fraud

Abuse

Policy violations

Legal requests

Suspended users cannot access protected features.

---

# 22. Account Deletion

Default

Soft delete.

Financial records remain for compliance.

Personally identifiable information may be anonymized where legally required.

---

# 23. Data Retention

Retain:

Payments

Invoices

Audit logs

Support history

Appointment history

according to applicable legal and business requirements.

---

# 24. Platform Configuration

Administrators may configure:

Commission percentage

Booking window

Cancellation window

Maximum reschedules

Notification timing

Maintenance mode

These values should be stored in `platform_settings`, not hardcoded.

---

# 25. Compliance Principles

Platform should be designed to support:

* Indian data protection requirements (e.g., DPDP Act obligations where applicable)
* Secure storage of personal information
* Least-privilege access
* Auditability
* Encryption in transit
* Secure authentication

Formal legal compliance should be reviewed before production launch.

---

# 26. Business Rule Precedence

If multiple rules conflict:

1. Legal or regulatory requirements
2. Platform settings
3. This document
4. Implementation

Developers must update this document before changing business behavior.

---

# 27. Kiro Implementation Rules

* Never hardcode business policies.
* Read configurable values from platform settings.
* Validate business rules in the service layer.
* Record policy-sensitive actions in audit logs.
* Treat this document as the authoritative source for business behavior.

---

# 28. Acceptance Criteria

The business rules are complete when:

* Booking behavior is fully defined.
* Payments and refunds are consistent.
* Cancellation and rescheduling policies are centralized.
* Platform settings control configurable behavior.
* Security and compliance principles are documented.
* No conflicting business rules exist across the project.

---

# End of Document
