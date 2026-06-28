# 00_PROJECT_OVERVIEW.md

# TalkIndia

### Enterprise Software Requirements Specification (SRS)

**Document Version:** 1.0

**Project Name:** TalkIndia

**Document Type:** Project Overview

**Status:** Draft

**Prepared For:** Kiro IDE / Claude Opus 4.8 Development Workflow

**Tech Stack**

* Next.js 15 (App Router)
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Supabase
* PostgreSQL
* Supabase Auth
* Supabase Storage
* Supabase Realtime
* Razorpay
* LiveKit (or Daily)
* Vercel
* GitHub

---

# 1. Executive Summary

TalkIndia is a digital healthcare marketplace that enables users to discover, compare, book, and attend appointments with verified mental health professionals.

Unlike generic healthcare platforms, TalkIndia focuses exclusively on mental healthcare.

The first production release focuses on becoming India's most trusted therapist booking platform.

The platform should provide a seamless experience for:

* Patients
* Therapists
* Psychiatrists
* Counsellors
* Platform Administrators

Version 1 intentionally excludes AI therapy, journaling, meditation, and wellness tracking to maintain a focused MVP.

---

# 2. Vision

To become India's most trusted mental healthcare marketplace by simplifying therapist discovery, appointment booking, secure payments, and online consultations.

---

# 3. Mission

Build a secure, scalable, production-grade SaaS platform that allows patients to receive quality mental healthcare while enabling therapists to manage their entire practice from one system.

---

# 4. Problem Statement

Finding a suitable therapist in India remains fragmented.

Patients often struggle with:

* Finding verified professionals
* Comparing expertise
* Transparent pricing
* Online booking
* Appointment reminders
* Secure online consultations

Therapists often struggle with:

* Appointment management
* Manual scheduling
* Payment collection
* Client management
* Calendar organization

TalkIndia solves these operational problems.

---

# 5. Product Scope

TalkIndia is a two-sided marketplace.

Side A

Patients

Side B

Mental Health Professionals

The platform acts as the intermediary.

Primary revenue is generated from appointment commissions.

---

# 6. Objectives

Version 1 objectives

* Therapist discovery
* Online appointment booking
* Calendar management
* Secure payment
* Video consultation
* Practice management
* Reviews
* Admin operations

---

# 7. Out of Scope (Version 1)

The following features SHALL NOT be implemented.

* AI Chatbot
* AI Therapist
* Mood Tracking
* Habit Tracking
* Journaling
* Meditation
* Self Assessments
* Community Forum
* Insurance
* Corporate Wellness
* Family Accounts

Future versions may introduce these modules.

---

# 8. User Roles

## Guest

Permissions

* Browse website
* Search therapists
* Read blogs
* View therapist profiles

Restrictions

* Cannot book appointments
* Cannot review therapists
* Cannot access dashboard

---

## Patient

Permissions

* Authentication
* Profile management
* Search therapists
* Apply filters
* Book appointments
* Make payments
* Join consultations
* Download invoices
* Review therapists
* Manage appointments

---

## Therapist

Permissions

* Register
* Upload verification documents
* Manage profile
* Configure availability
* Conduct consultations
* Access appointment history
* View earnings

Note: Bookings are instant after patient payment. Therapists do not manually accept or reject individual bookings.

---

## Administrator

Permissions

* Full system access
* Therapist verification
* User management
* Payment management
* Refund management
* Blog management
* Reports
* Analytics
* System configuration

---

# 9. Primary Business Flow

Guest

↓

Browse Therapists

↓

Patient Registration

↓

Login

↓

Search Therapist

↓

Open Profile

↓

Choose Date

↓

Choose Time Slot

↓

Complete Payment

↓

Appointment Confirmed

↓

Receive Notifications

↓

Join Consultation

↓

Appointment Completed

↓

Leave Review

↓

Book Follow-up

---

# 10. Core Modules

The platform consists of the following production modules.

1. Landing Website

2. Authentication

3. Patient Dashboard

4. Therapist Dashboard

5. Admin Dashboard

6. Therapist Directory

7. Booking Engine

8. Availability Engine

9. Payment Module

10. Video Consultation

11. Reviews

12. Notifications

13. CMS

14. Analytics

---

# 11. Revenue Model

Primary Revenue

Platform commission on completed appointments.

Future Revenue

* Therapist subscription
* Featured listings
* Sponsored profiles
* Corporate plans
* Premium tools

---

# 12. Design Philosophy

The application must prioritize

* Accessibility
* Privacy
* Performance
* Scalability
* Simplicity
* Reusability
* Maintainability

---

# 13. Technical Principles

The system SHALL

* Follow Clean Architecture
* Use reusable components
* Avoid duplicated logic
* Maintain strict TypeScript typing
* Use Server Components where appropriate
* Prefer Server Actions
* Validate all input
* Keep business logic separated from UI

---

# 14. Security Principles

The platform manages sensitive healthcare information.

Therefore

* Every database table MUST use Row Level Security.
* Authentication MUST be mandatory for protected operations.
* Patient data MUST never be accessible by other patients.
* Therapist data MUST be isolated.
* Secrets MUST remain server-side.
* Payment verification MUST occur server-side.

---

# 15. Scalability Goals

The architecture should be clean enough that future expansion is possible without a complete rewrite.

Potential future additions (not in MVP):

* Mobile applications
* AI modules
* Multi-language support
* Insurance integrations

These should not influence current implementation decisions.

---

# 16. Success Metrics

Version 1 success indicators

Business

* A patient can book and attend a consultation end-to-end
* Therapist onboarding and verification works
* Payments are processed correctly

Technical

* Page loads quickly
* No critical security vulnerabilities
* Clean, maintainable code
* Responsive on all devices
* Deployable to Vercel

---

# 17. Development Rules

The following rules apply to every module.

1. Documentation is the source of truth.

2. No undocumented features shall be implemented.

3. Every feature must satisfy its acceptance criteria.

4. Every module must be independently testable.

5. Every database change requires migration.

6. Every API requires validation.

7. Every page must handle loading, success, empty, and error states.

8. Every component should be reusable whenever practical.

9. Code quality takes priority over development speed.

10. Git commits should represent complete logical units of work.

---

# 18. Kiro Instructions

Before implementing any feature:

1. Read the relevant documentation files.
2. Do not assume missing requirements.
3. Ask for clarification if documentation is incomplete.
4. Implement one module at a time.
5. Update Tasks.md after completing work.
6. Never modify unrelated modules.
7. Maintain production-grade architecture.
8. Follow established folder structure and coding standards.

---

# End of Document
