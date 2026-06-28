# README.md

# TalkIndia

## AI-Powered Mental Healthcare Marketplace

Version: 1.0

---

# Welcome

Welcome to the TalkIndia codebase.

This project is designed to be built with strict engineering standards, modular architecture, and AI-assisted development using Kiro.

This README is the entry point for every developer and AI coding assistant working on the project.

Do not begin implementation before reading this document.

---

# Project Vision

TalkIndia connects patients with verified mental health professionals through a secure, modern, and scalable booking platform.

Core objectives:

* Help patients discover trusted therapists.
* Simplify online appointment booking.
* Provide secure video consultations.
* Deliver a professional dashboard for therapists.
* Provide administrators with operational control over the platform.

---

# Documentation Philosophy

Documentation is the source of truth.

If implementation differs from documentation, documentation wins unless it has been intentionally updated.

Never invent functionality that is not documented.

---

# Documentation Structure

```text
/docs

00_PROJECT_OVERVIEW.md

01_PRODUCT_REQUIREMENTS.md

02_USER_FLOWS.md

03_INFORMATION_ARCHITECTURE.md

04_SYSTEM_ARCHITECTURE.md

05_DATABASE_DOMAIN_MODEL.md

06_USERS_AND_AUTH_SCHEMA.md (Combined: Parts 06.01–06.05)

06.06_ROW_LEVEL_SECURITY_AND_AUTHORIZATION.md

07_API_SPECIFICATION.md

08_UI_SCREEN_SPECIFICATION (Combined: Parts 08.01–08.09)

09_DEVELOPMENT_GUIDELINES.md

10_BACKEND_ARCHITECTURE.md

11_IMPLEMENTATION_ROADMAP.md

12_BUSINESS_RULES.md
```

---

# Reading Order

Read documents in this order:

1. Project Overview
2. Product Requirements
3. User Flows
4. Information Architecture
5. System Architecture
6. Database Domain Model
7. Database Schema
8. API Specification
9. UI Specifications
10. Frontend Architecture
11. Backend Architecture
12. Business Rules
13. Development Guidelines
14. Implementation Roadmap

Never skip documents.

---

# Source of Truth

| Topic                | Source Document                               |
| -------------------- | --------------------------------------------- |
| Product Requirements | 01_PRODUCT_REQUIREMENTS.md                    |
| User Journeys        | 02_USER_FLOWS.md                              |
| Navigation           | 03_INFORMATION_ARCHITECTURE.md                |
| Backend Architecture | 10_BACKEND_ARCHITECTURE.md                    |
| Database             | 06_USERS_AND_AUTH_SCHEMA.md (Parts 06.01–06.05) |
| Security             | 06.06_ROW_LEVEL_SECURITY_AND_AUTHORIZATION.md   |
| APIs                 | 07_API_SPECIFICATION.md                       |
| UI                   | 08_UI/*                                       |
| Business Rules       | 12_BUSINESS_RULES.md                          |
| Development Workflow | 09_DEVELOPMENT_GUIDELINES.md                  |

---

# Tech Stack

Frontend

* Next.js 15
* React
* TypeScript
* Tailwind CSS
* shadcn/ui

Backend

* Supabase
* PostgreSQL
* Server Actions

Infrastructure

* Vercel
* Razorpay
* LiveKit
* Resend

---

# Folder Structure

```text
app/
features/
components/
lib/
services/
repositories/
actions/
providers/
hooks/
schemas/
types/
utils/
constants/
styles/
public/
docs/
```

Feature-first organization is mandatory.

---

# Engineering Principles

* Server Components by default.
* Client Components only when needed.
* Repositories handle database access.
* Services contain business logic.
* Server Actions orchestrate requests.
* Components remain presentational.
* Validation uses Zod.
* Authentication uses Supabase Auth.
* Authorization uses RLS.

---

# Coding Standards

* Strict TypeScript.
* No `any`.
* No duplicated logic.
* Reusable components.
* Feature isolation.
* Semantic HTML.
* Accessible interfaces.

---

# Git Workflow

Branch naming:

```text
feature/*
fix/*
docs/*
refactor/*
hotfix/*
```

Commit format:

```text
type(scope): description
```

Examples:

```text
feat(booking): implement booking wizard

fix(payment): verify webhook signature

docs(ui): update patient dashboard specification
```

---

# Documentation Rules

Whenever implementation changes:

Update:

* Documentation
* Tasks
* Roadmap (if required)

Documentation changes are part of feature completion.

---

# Kiro Workflow

For every feature:

1. Read relevant documentation.
2. Understand business rules.
3. Review API contract.
4. Review database schema.
5. Implement backend.
6. Implement frontend.
7. Test.
8. Update documentation.
9. Commit changes.

Never implement undocumented features.

---

# Security Principles

* Never expose service-role credentials.
* Validate all input.
* Enforce Row Level Security.
* Use least-privilege access.
* Log sensitive administrative actions.

---

# Definition of Done

A feature is complete only when:

* Implementation finished.
* Build passes.
* TypeScript passes.
* Lint passes.
* Documentation updated.
* Responsive.
* Accessible.
* Secure.
* Tested.
* Committed.

---

# Important Notes for Kiro

* Build one feature at a time.
* Never skip architecture layers.
* Follow the feature-first structure.
* Reuse components whenever possible.
* Keep business logic in services.
* Keep repositories responsible only for data access.
* Keep documentation synchronized with implementation.
* Ask for clarification instead of making assumptions when documentation conflicts.

---

# Project Status

Current Status

Planning Complete

Architecture Complete

Database Design Complete

API Design Complete

UI Design Complete

Ready for Implementation

---

# End of README
