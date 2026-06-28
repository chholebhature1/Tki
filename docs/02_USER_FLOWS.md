# 02_USER_FLOWS.md

# TalkIndia

## User Flow Specification

Version: 1.0

Dependencies

* 00_PROJECT_OVERVIEW.md
* 01_PRODUCT_REQUIREMENTS.md

---

# Purpose

This document defines every major user journey inside TalkIndia.

Every screen transition, decision, and system response must follow these flows.

If implementation differs from this document, this document takes precedence.

---

# User Types

The platform contains four user roles.

1. Guest
2. Patient
3. Therapist
4. Administrator

Each role has its own navigation flow.

---

# 1. Guest Journey

## Goal

Allow visitors to explore the platform before registering.

### Flow

Landing Page

↓

Browse Website

↓

Search Therapists

↓

Open Therapist Profile

↓

Read Reviews

↓

Attempt Booking

↓

Redirect to Login / Signup

---

Allowed Pages

* Home
* About
* Services
* Blog
* FAQ
* Contact
* Privacy Policy
* Terms
* Therapist Directory
* Therapist Profile

Restrictions

Guests cannot:

* Book appointments
* Write reviews
* Access dashboards
* Join consultations
* View invoices

---

# 2. Patient Registration Flow

Landing Page

↓

Click Sign Up

↓

Choose "Patient"

↓

Enter Details

↓

Email Verification

↓

Login

↓

Complete Profile

↓

Patient Dashboard

Required Information

* Name
* Email
* Password
* Phone
* Date of Birth
* Gender

System Actions

* Create Auth User
* Create Profile
* Assign Patient Role
* Send Verification Email

Failure States

* Email already exists
* Weak password
* Invalid email
* Verification expired

---

# 3. Patient Login Flow

Login

↓

Enter Credentials

↓

Authenticate

↓

Success

↓

Patient Dashboard

Failure

↓

Display Error

↓

Retry

Forgot Password

↓

Reset Email

↓

Create New Password

↓

Login

---

# 4. Therapist Registration Flow

Landing Page

↓

Join as Therapist

↓

Create Account

↓

Verify Email

↓

Complete Professional Profile

↓

Upload Documents

↓

Submit Verification

↓

Pending Approval

↓

Admin Review

↓

Approved

↓

Therapist Dashboard

Rejected

↓

Receive Feedback

↓

Update Documents

↓

Resubmit

Required Documents

* Government ID
* Professional License
* Degree Certificate
* Profile Photograph

Therapists MUST NOT appear in search before approval.

---

# 5. Therapist Discovery Flow

Patient Dashboard

↓

Search Therapists

↓

Apply Filters

↓

Browse Results

↓

Open Profile

↓

Read About

↓

View Availability

↓

Book Appointment

Filters

* Language
* Gender
* Price
* Rating
* Online
* In Person
* Experience
* Specialization

Sorting

* Recommended
* Highest Rated
* Lowest Price
* Most Experienced

---

# 6. Appointment Booking Flow

Patient

↓

Open Therapist Profile

↓

Select Consultation Type

↓

Choose Date

↓

Choose Available Slot

↓

Lock Slot (5-minute expiry, stored in DB)

↓

Create Appointment (status: payment_pending)

↓

Proceed to Payment (Razorpay)

↓

Payment Success (webhook verifies)

↓

Update Appointment (status: confirmed)

↓

Generate Video Session

↓

Send Notifications

↓

Booking Confirmed

Failure

Payment Failed

↓

Appointment deleted or marked failed

↓

Slot lock released

↓

Retry Payment

Business Rules

Only one patient may reserve a slot at a time.

Slot lock expires automatically after 5 minutes.

Appointment record created before payment with status `payment_pending`.

Appointment moves to `confirmed` only after server-side Razorpay webhook verification.

If payment fails or lock expires, the appointment is deleted.

---

# 7. Appointment Lifecycle

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

Every appointment must always have exactly one status.

Status transitions:
- `payment_pending` → `confirmed` (after Razorpay webhook verification)
- `confirmed` → `completed` (after session ends)
- `confirmed` → `cancelled` (patient or admin cancels)
- `confirmed` → `rescheduled` (patient reschedules)
- `confirmed` → `no_show` (neither party joins)
- `cancelled` → `refunded` (after refund processed)

---

# 8. Video Consultation Flow

Appointment Confirmed

↓

Meeting Created

↓

Reminder

↓

Patient Joins

↓

Therapist Joins

↓

Session Active

↓

Session Ends

↓

Appointment Completed

↓

Review Request

Business Rules

Meeting link visible only after confirmation.

Meeting inaccessible before scheduled time.

Meeting automatically expires after completion.

---

# 9. Cancellation Flow

Patient Opens Appointment

↓

Cancel Appointment

↓

System Checks Policy

↓

Eligible

↓

Refund Process

↓

Appointment Cancelled

↓

Slot Released

Not Eligible

↓

Display Reason

↓

Cancellation Denied

---

# 10. Reschedule Flow

Open Appointment

↓

Choose New Slot

↓

Availability Check

↓

Update Booking

↓

Notify Therapist

↓

Notify Patient

↓

Calendar Updated

Rules

Only future appointments can be rescheduled.

---

# 11. Therapist Daily Workflow

Login

↓

Dashboard

↓

Today's Schedule

↓

Patient Details

↓

Join Session

↓

Session Complete

↓

Add Notes

↓

Next Appointment

Daily Dashboard

* Today's Bookings
* Earnings
* Upcoming Sessions
* Notifications

---

# 12. Admin Workflow

Login

↓

Admin Dashboard

↓

Review Therapist Applications

↓

Approve / Reject

↓

Monitor Appointments

↓

Handle Refunds

↓

Resolve Support Tickets

↓

Publish Blogs

↓

Analytics

Permissions

Admins can access every module.

---

# 13. Review Flow

Appointment Completed

↓

Prompt Review

↓

Select Rating

↓

Write Review

↓

Submit

↓

Publish

Rules

One review per appointment.

Reviews editable for 24 hours.

Only verified patients may review.

---

# 14. Notification Flow

Events

Booking Confirmed

↓

Email

↓

Dashboard Notification

Reminder (24 Hours)

↓

Reminder (1 Hour)

↓

Reminder (15 Minutes)

↓

Session Start

↓

Completion

↓

Review Request

Future

SMS

Push

WhatsApp

---

# 15. Error Flows

Booking Conflict

Show latest availability.

Payment Failure

Retry payment.

Session Expired

Return to dashboard.

Unauthorized Access

Redirect to login.

Verification Pending

Display pending status.

Server Error

Show generic error page.

---

# 16. Global Navigation

Guest

Home

About

Services

Find Therapist

Blog

Login

Register

Patient

Dashboard

Find Therapist

Appointments

Notifications

Profile

Settings

Therapist

Dashboard

Calendar

Appointments

Patients

Availability

Earnings

Profile

Admin

Dashboard

Users

Therapists

Appointments

Payments

Blogs

Analytics

Settings

---

# 17. Acceptance Criteria

A feature is complete only if:

Every flow works from start to finish.

Failure states are handled gracefully.

Navigation matches documentation.

Unauthorized access is blocked.

Business rules are enforced.

Notifications trigger correctly.

Appointment state transitions are valid.

---

# 18. Kiro Implementation Rules

Implement flows exactly as documented.

Do not skip intermediate states.

Never expose unauthorized data.

All transitions must be validated on the server.

Every flow must support:

* Loading state
* Empty state
* Success state
* Error state

No flow may bypass authentication or business rules.

---

End of Document.
