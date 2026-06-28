# 09_DEVELOPMENT_GUIDELINES.md

# TalkIndia

## Engineering Standards & Development Workflow

Version: 1.0

Dependencies

* All previous documentation

---

# 1. Purpose

Defines the engineering standards for TalkIndia.

Every feature, migration, component, and commit must follow this document.

Goals

* Consistency
* Maintainability
* Security
* High code quality
* Predictable architecture

---

# 2. Definition of Done

A task is complete when:

* Feature works end-to-end
* TypeScript passes (no errors)
* ESLint passes
* Build succeeds
* Loading, empty, and error states handled
* Responsive on mobile + desktop
* Git committed

---

# 3. Development Workflow

Every feature follows this order:

```text id="workflow"
Read Documentation

↓

Understand Feature

↓

Create Database Migration (if needed)

↓

Build Backend

↓

Build UI

↓

Testing

↓

Documentation Update

↓

Git Commit
```

Never skip documentation.

---

# 4. Git Strategy

Default Branch

main

Feature Branches

feature/auth

feature/booking

feature/payments

feature/dashboard

Bug Fixes

fix/payment-webhook

Keep it simple. No develop branch needed for a solo/small team project.

---

# 5. Commit Message Convention

Format

```text id="commit"
type(scope): description
```

Examples

```text id="commit-examples"
feat(booking): add appointment creation flow

fix(payments): verify Razorpay webhook signature

refactor(profile): simplify therapist profile service

docs(api): update booking API specification

style(ui): improve therapist card spacing

chore(deps): update dependencies
```

Allowed Types

feat

fix

refactor

style

docs

test

perf

build

chore

---

# 6. Code Quality

Before committing:

* No TypeScript errors
* No ESLint errors
* Feature works correctly
* UI matches design system

---

# 7. Coding Standards

Use strict TypeScript.

Never use:

```ts id="bad-any"
any
```

Prefer:

```ts id="good-types"
unknown

or

specific interfaces
```

Functions should remain small and focused.

---

# 8. Naming Conventions

Components

PascalCase

Hooks

useSomething

Schemas

something.schema.ts

Types

something.types.ts

Services

something.service.ts

Repositories

something.repository.ts

Actions

something.actions.ts

Constants

UPPER_SNAKE_CASE where appropriate

---

# 9. Folder Rules

Features remain isolated.

Shared code goes in:

lib/

components/

utils/

No feature should directly manipulate another feature's internal files.

---

# 10. Styling Rules

Use Tailwind CSS.

Use design tokens only.

Never hardcode colors.

Never hardcode spacing.

Prefer reusable utility patterns.

---

# 11. Forms

React Hook Form

Zod

Inline validation

Server validation

Accessible labels

Loading state

Error state

---

# 12. Server Actions

Every Server Action must:

Authenticate

Authorize

Validate

Execute business logic

Return predictable response

Log important events

---

# 13. Database Rules

Never query Supabase directly from UI components.

Only repositories communicate with the database.

Business logic belongs in services.

Enable RLS on every protected table.

---

# 14. Security Rules

Never expose:

Service Role Key

Secrets

Private tokens

Validate every input.

Escape user-generated content.

Protect sensitive routes with middleware and RLS.

---

# 15. Error Handling

Every feature supports:

Loading

Success

Empty

Validation Error

Unauthorized

Unexpected Error

Never expose stack traces.

---

# 16. Logging

Log:

Authentication failures

Payment events

Appointment lifecycle

Verification decisions

Unexpected server errors

Never log:

Passwords

Tokens

Medical notes

Personal secrets

---

# 17. Performance

Prefer Server Components.

Optimize images.

Use lazy loading.

Paginate large datasets.

Avoid unnecessary re-renders.

Keep JavaScript bundles small.

---

# 18. Accessibility

WCAG AA

Keyboard navigation

Visible focus

ARIA labels

Semantic HTML

Touch targets ≥ 44px

---

# 19. Documentation Rules

Documentation (`/docs`) is the design source of truth.

Read docs before implementing a feature.

If the implementation deviates from docs significantly, update the relevant doc.

Don't over-document during active development — focus on building.

---

# 20. Environment Variables

Store in:

.env.local

Never commit secrets.

Required

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE_KEY

RAZORPAY_KEY_ID

RAZORPAY_KEY_SECRET

LIVEKIT_API_KEY

LIVEKIT_API_SECRET

RESEND_API_KEY

---

# 21. Testing Guidelines

For MVP: manual testing is acceptable.

Critical paths to verify before demo:

1. Patient registration + login
2. Therapist registration + verification
3. Full booking flow (search → book → pay → confirm)
4. Video consultation (join + end)
5. Review submission
6. Admin approval workflow

Future: Add unit tests for critical services (BookingService, PaymentService).

---

# 22. AI Coding Rules (Kiro)

Before writing code:

* Read all files in `/docs`.
* Treat documentation as the source of truth.
* Never invent undocumented features.
* Follow the feature-first architecture.
* Reuse existing components before creating new ones.
* Never bypass validation or RLS.
* Update `Tasks.md` after completing work.
* Create a meaningful Git commit after each completed feature.
* If documentation conflicts, stop and request clarification rather than guessing.

---

# 23. Release Checklist

Before deploying to Vercel:

* Build passes locally
* Environment variables set in Vercel dashboard
* Razorpay webhook URL configured in Razorpay dashboard
* Supabase RLS policies enabled
* Full booking flow tested manually
* Responsive layouts checked

---

# 24. Definition of Success

The project is production-ready when:

* A patient can register, find a therapist, book, pay, and attend a video consultation.
* A therapist can register, get verified, set availability, and conduct sessions.
* An admin can verify therapists, manage users, and publish blog posts.
* The app is deployed on Vercel and accessible via URL.
* The code is clean, typed, and well-organized.

---

# 25. Kiro Final Instructions

When implementing TalkIndia:

1. Read all documents before writing code.
2. Build one feature module at a time.
3. Finish a feature completely before starting another.
4. Keep architecture clean and modular.
5. Prefer reusable components over duplication.
6. Keep business logic out of React components.
7. Treat the database schema and RLS policies as authoritative.
8. Never sacrifice security for convenience.
9. Keep the codebase production-ready at every stage.
10. Leave the project in a better state than you found it after every change.

---

# End of Document
