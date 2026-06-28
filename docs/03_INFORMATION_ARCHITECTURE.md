# 03_INFORMATION_ARCHITECTURE.md

# TalkIndia

## Information Architecture & Navigation Specification

Version: 1.0

Dependencies

* 00_PROJECT_OVERVIEW.md
* 01_PRODUCT_REQUIREMENTS.md
* 02_USER_FLOWS.md

---

# 1. Purpose

This document defines the complete information architecture of TalkIndia.

It specifies:

* Navigation hierarchy
* Route structure
* Dashboard organization
* Public pages
* Protected pages
* URL conventions
* Layout hierarchy

Every screen implemented in TalkIndia must exist within this document.

---

# 2. Navigation Principles

The platform shall use four independent navigation systems.

1. Public Navigation
2. Patient Navigation
3. Therapist Navigation
4. Admin Navigation

Each role must only access its own navigation.

---

# 3. Public Website

Accessible without authentication.

Routes

/

Landing Page

/about

About Us

/services

Services

/find-therapists

Therapist Directory

/therapists/[slug]

Therapist Profile

/blog

Blog Listing

/blog/[slug]

Blog Article

/contact

Contact

/faq

FAQ

/privacy-policy

Privacy Policy

/terms

Terms & Conditions

/login

Login

/register

Register

---

# 4. Landing Page Structure

Navigation

↓

Hero Section

↓

Search Therapist

↓

How TalkIndia Works

↓

Popular Specializations

↓

Featured Therapists

↓

Patient Testimonials

↓

FAQ

↓

Footer

---

# 5. Authentication Routes

/login

/register

/register/patient

/register/therapist

/forgot-password

/reset-password

/email-verification

/logout

---

# 6. Patient Portal

Base Route

/dashboard

Sub Routes

/dashboard

Overview

/dashboard/profile

Profile

/dashboard/appointments

Appointments

/dashboard/appointments/upcoming

Upcoming

/dashboard/appointments/history

History

/dashboard/appointments/[appointmentId]

Appointment Details

/dashboard/find-therapists

Therapist Search

/dashboard/bookings

Bookings

/dashboard/reviews

Reviews

/dashboard/notifications

Notifications

/dashboard/settings

Settings

---

# 7. Therapist Portal

Base Route

/therapist

Sub Routes

/therapist/dashboard

Overview

/therapist/profile

Profile

/therapist/profile/edit

Edit Profile

/therapist/availability

Availability

/therapist/calendar

Calendar

/therapist/appointments

Appointments

/therapist/appointments/[appointmentId]

Appointment Details

/therapist/patients

Patient List

/therapist/earnings

Earnings

/therapist/reviews

Reviews

/therapist/settings

Settings

---

# 8. Admin Portal

Base Route

/admin

Sub Routes

/admin/dashboard

Overview

/admin/users

Users

/admin/patients

Patients

/admin/therapists

Therapists

/admin/verification

Verification Requests

/admin/appointments

Appointments

/admin/payments

Payments

/admin/refunds

Refunds

/admin/blog

Blog CMS

/admin/support

Support Tickets

/admin/analytics

Analytics

/admin/settings

Platform Settings

---

# 9. Therapist Profile Architecture

Every therapist profile shall contain:

Hero

Profile Photo

Verification Badge

Name

Qualification

Experience

Languages

Fee

Book Button

Tabs

Overview

Experience

Education

Specializations

Reviews

Availability

---

# 10. Dashboard Layout Standards

Every dashboard must contain:

Top Navigation

↓

Sidebar

↓

Page Header

↓

Breadcrumb

↓

Main Content

↓

Footer

---

# 11. Sidebar Structure

Patient

Dashboard

Appointments

Find Therapist

Reviews

Notifications

Settings

Logout

---

Therapist

Dashboard

Calendar

Appointments

Patients

Availability

Earnings

Reviews

Settings

Logout

---

Admin

Dashboard

Users

Therapists

Verification

Appointments

Payments

Refunds

CMS

Analytics

Support

Settings

Logout

---

# 12. Route Protection Matrix

Public

No authentication required.

Patient Routes

Patient only.

Therapist Routes

Therapist only.

Admin Routes

Administrator only.

Unauthorized users must receive HTTP 403 or be redirected to login.

---

# 13. URL Naming Rules

Use lowercase.

Use kebab-case.

Avoid query parameters where dynamic routes are appropriate.

Examples

Correct

/find-therapists

/dashboard/appointments

/therapists/dr-ravi-sharma

Incorrect

/FindTherapists

/profile?id=4

---

# 14. Breadcrumb Rules

Every protected page must display breadcrumbs.

Example

Dashboard

>

Appointments

>

Appointment Details

---

# 15. Search Architecture

Patient searches should support:

Keyword

Specialization

Language

Gender

Experience

Rating

Price

Consultation Mode

Availability

Sorting

Results should be paginated.

---

# 16. Navigation Rules

Every page must contain a clear way to:

Go Back

Return Home

Access Dashboard (authenticated)

Logout

Users should never reach a dead end.

---

# 17. Empty States

Every list page requires an empty state.

Examples

No Appointments

No Reviews

No Notifications

No Search Results

Each empty state should explain why it is empty and provide a primary action.

---

# 18. Error Pages

404

Page Not Found

403

Unauthorized

500

Internal Server Error

Maintenance Page

Offline Page (future PWA)

---

# 19. Responsive Behaviour

Desktop

Sidebar visible.

Tablet

Collapsible sidebar.

Mobile

Bottom navigation for patients.

Hamburger navigation for therapists and admins.

No horizontal scrolling.

---

# 20. Global Components

Available on all applicable pages:

Header

Footer

Toast Notifications

Confirmation Modal

Loading Spinner

Skeleton Loader

Search Bar

Profile Menu

Theme Switcher (future)

---

# 21. Accessibility Requirements

Keyboard navigation.

Visible focus states.

ARIA labels.

Semantic HTML.

Screen reader compatibility.

Minimum contrast ratio compliant with WCAG AA.

---

# 22. Acceptance Criteria

Information architecture is complete when:

* Every page has a defined route.
* Every page belongs to exactly one layout.
* Every protected page has role-based access.
* Navigation is consistent.
* Breadcrumbs are implemented.
* Empty states exist.
* Error pages exist.
* Responsive behaviour is defined.

---

# 23. Kiro Implementation Rules

Implement layouts before implementing pages.

Use nested layouts with Next.js App Router.

Keep navigation configuration centralized.

Do not hardcode routes in components.

Use reusable layout components.

Maintain consistent spacing, typography, and navigation patterns across the application.

No page should exist without being documented here.

---

End of Document.
