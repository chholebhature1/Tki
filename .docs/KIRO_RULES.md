# TalkIndia Development Rules

Read every document inside /docs before implementing any feature.

Documentation is the source of truth.

Never invent features.

Never change database schema without updating documentation.

Always use:

- Next.js App Router
- TypeScript (strict)
- Tailwind CSS
- shadcn/ui
- Supabase
- Server Actions
- Route Handlers
- Repository Pattern
- Service Layer
- Zod
- React Hook Form

Architecture

UI

↓

Server Action

↓

Service

↓

Repository

↓

Supabase

↓

Database

Never bypass this flow.

Always build one feature completely before moving to another.

Never leave TODO code.

Never use `any`.

Never hardcode colors.

Use the design tokens.

Update Tasks.md after every completed task.

Commit after every completed feature.

Never start another feature until the previous one passes TypeScript and ESLint.
