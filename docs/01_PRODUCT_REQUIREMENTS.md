# 01_PRODUCT_REQUIREMENTS.md

# TalkIndia

## Product Requirements Document (PRD)

Version: 1.0

Status: Approved for Development

Dependencies:

* 00_PROJECT_OVERVIEW.md

---

# 1. Purpose

This document defines the functional scope of TalkIndia Version 1.

Every feature implemented in the application MUST originate from this document.

If a feature is not documented here, it SHALL NOT be developed without approval.

---

# 2. Product Definition

TalkIndia is a therapist marketplace that allows patients to discover, compare, book and consult verified mental health professionals.

The platform acts as a trusted intermediary between patients and therapists.

Primary business objective:

Increase successful appointment bookings.

---

# 3. MVP Scope

Version 1 contains only features required to successfully operate a therapist marketplace.

Included:

* Landing Website
* Authentication
* Therapist Discovery
* Booking System
* Calendar Management
* Payments
* Video Consultation
* Notifications
* Reviews
* Dashboards
* Admin Portal
* CMS

Excluded:

* AI Chat
* AI Therapy
* Mood Tracking
* Journaling
* Community
* Meditation
* Insurance
* Corporate Wellness
* Mobile Applications

---

# 4. Functional Modules

The system is divided into independent modules.

Each module must be developed separately.

## Module 1

Landing Website

Purpose:

Marketing and SEO.

Features:

* Home
* About
* Services
* Find Therapist
* Pricing
* FAQ
* Contact
* Blog
* Privacy Policy
* Terms & Conditions

Acceptance Criteria

* Fully responsive
* SEO optimized
* Accessible
* Fast loading

---

## Module 2

Authentication

Purpose

Secure user access.

Supported methods

* Email
* Password
* Google OAuth

Features

* Login
* Register
* Forgot Password
* Reset Password
* Email Verification
* Logout
* Session Management

User Types

* Patient
* Therapist
* Admin

Acceptance Criteria

* Secure authentication
* Protected routes
* Role-based access

---

## Module 3

Patient Profile

Purpose

Store patient information.

Fields

* Name
* Gender
* Date of Birth
* Phone
* Email
* Emergency Contact
* City
* State
* Profile Photo

Features

* Edit Profile
* Upload Avatar
* View Appointment History

---

## Module 4

Therapist Profile

Purpose

Allow therapists to showcase professional information.

Profile includes

* Name
* Photo
* Qualification
* License Number
* Experience
* Bio
* Languages
* Consultation Fee
* Consultation Modes
* Specializations
* Education
* Certificates
* Ratings
* Reviews

Features

* Profile Editing
* Document Upload
* Verification Status

---

## Module 5

Therapist Search

Purpose

Help patients find suitable professionals.

Filters

* Price
* Rating
* Gender
* Language
* Experience
* Online
* In-Person
* Specialization
* Availability

Sorting

* Recommended
* Lowest Price
* Highest Rated
* Most Experienced

---

## Module 6

Booking Engine

Purpose

Appointment scheduling.

Booking Flow

Search

↓

Profile

↓

Choose Date

↓

Choose Time

↓

Payment

↓

Confirmation

↓

Consultation

↓

Review

Features

* Slot selection
* Temporary slot locking
* Booking confirmation
* Cancellation
* Rescheduling

Rules

Only available slots may be booked.

Double booking is prohibited.

---

## Module 7

Availability Management

Purpose

Therapists define working schedule.

Features

* Weekly schedule
* Holidays
* Breaks
* Buffer time
* Time slot generation

Rules

Booked slots disappear automatically.

---

## Module 8

Payment System

Purpose

Collect payments securely.

Gateway

Razorpay

Features

* UPI
* Card
* Net Banking
* Wallet
* Invoice
* Refund

Rules

Appointment created only after verified payment.

---

## Module 9

Video Consultation

Purpose

Online therapy sessions.

Provider

LiveKit

Features

* Meeting Room
* Join Button
* Session Timer

Rules

Meeting URL generated after payment.

---

## Module 10

Notifications

Channels

Email

SMS

WhatsApp (Future)

Push (Future)

Events

Booking

Reminder

Cancellation

Reschedule

Payment

Review Request

---

## Module 11

Reviews

Patients can review only completed appointments.

Fields

* Rating
* Comment

Rules

One review per appointment.

---

## Module 12

Patient Dashboard

Sections

Upcoming Appointments

Previous Appointments

Invoices

Notifications

Settings

Profile

---

## Module 13

Therapist Dashboard

Sections

Today's Appointments

Calendar

Patients

Earnings

Availability

Reviews

Profile

Verification

---

## Module 14

Admin Dashboard

Features

Manage Users

Manage Therapists

Verify Documents

Payments

Refunds

Appointments

Blogs

Analytics

Support Tickets

CMS

---

# 5. Non Functional Requirements

Performance

Page Load

<2 Seconds

Accessibility

WCAG AA

Availability

99.9%

Scalability

100,000+ users

Security

Supabase Row Level Security

Responsive

Desktop

Tablet

Mobile

---

# 6. Business Rules

Patients cannot book unavailable slots.

Therapists cannot approve themselves.

Admin verification required before therapist listings become public.

Payments must succeed before appointments are confirmed.

Patients can only review completed appointments.

Users may access only their own data unless authorized.

---

# 7. Acceptance Criteria

Version 1 is complete when:

* Patients can register.
* Therapists can onboard.
* Admin can verify therapists.
* Patients can discover therapists.
* Patients can book appointments.
* Payments are processed successfully.
* Online consultation works.
* Reviews can be submitted.
* Notifications are delivered.
* Dashboards operate correctly.

---

# 8. Future Modules

Version 2

* AI Assistant
* Mood Tracker
* Journaling
* Meditation
* Community
* Insurance
* Corporate Dashboard
* Mobile Apps

These modules must not influence Version 1 architecture negatively.

---

# 9. Implementation Rules for Kiro

Before writing code:

Read:

00_PROJECT_OVERVIEW.md

01_PRODUCT_REQUIREMENTS.md

Never implement undocumented functionality.

Every feature must satisfy its acceptance criteria.

Every module should remain independent and reusable.

Do not modify completed modules unless required.

Follow clean architecture.

Follow strict TypeScript.

Use reusable components.

Implement server-side validation for critical operations.

Use Supabase Row Level Security for every protected table.

End of Document.
