# Google Calendar Clone Plan

## Current repo baseline

- Next.js 16 App Router with Convex Auth and protected `/calendar` route.
- Bun is the package manager (`bun.lock`).
- shadcn Base UI style is configured (`components.json` style: `base-nova`).
- Auth forms already use TanStack Form + Zod.
- Convex schema includes auth tables and one-off calendar events.
- `/calendar` has the initial authenticated calendar shell with URL-driven view/date navigation.

## Goal

Build a Google Calendar-style app with authenticated calendar event management, daily/weekly/monthly views, and drag-and-drop event rescheduling using `@dnd-kit/react`.

## Implementation phases

### 1. Calendar data model and Convex API

- [x] Add `@dnd-kit/react` dependency with Bun.
- [x] Add event tables to `convex/schema.ts`.
  - Event fields: `userId`, `title`, `description?`, `startAt`, `endAt`, `allDay`, `color?`, `location?`, timestamps.
  - Index by `userId` + `startAt` for range queries.
- [x] Add shared authenticated Convex helpers so browser callers cannot spoof `userId`.
- [x] Add event queries/mutations under `convex/events/`.
  - Query events by visible date range.
  - Create event.
  - Update event details.
  - Move/resize event dates from drag-and-drop.
  - Delete event.
- [x] Validate mutation args with Convex validators and enforce `endAt > startAt`.

### 2. Calendar routing and state

- [x] Replace `/calendar` placeholder with the authenticated calendar shell.
- [x] Model URL-driven calendar state.
  - `view=day|week|month`
  - `date=YYYY-MM-DD`
- [x] Add calendar navigation controls.
  - Today
  - Previous/next range
  - View switcher
- [x] Add date utility helpers for visible ranges, week starts, month grids, and time-slot math.

### 3. Calendar UI foundation

- [x] Create feature folder: `features/calendar/`.
- [x] Add reusable calendar components.
  - `calendar-shell`
  - `calendar-toolbar`
  - `day-view`
  - `week-view`
  - `month-view`
  - `event-card`
  - `time-grid`
- [x] Render events from Convex in all three views.
- [x] Use CSS grid/flex layout for Google Calendar-like structure.
- [x] Keep UI responsive enough for desktop first, with mobile follow-up if needed.

### 4. Event create/edit UX

- [ ] Add an event create/edit form using TanStack Form + Zod.
- [ ] Support creating from toolbar button.
- [ ] Support creating by clicking a day cell/time slot.
- [ ] Support editing by clicking an existing event.
- [ ] Add delete support.
- [ ] Use shadcn/Base UI-compatible components and avoid `asChild`.

### 5. Drag-and-drop rescheduling with `@dnd-kit/react`

- [ ] Read and follow `@dnd-kit/react` documentation/API for current package version before implementation.
- [ ] Wrap calendar views in a DnD provider/context as documented.
- [ ] Make event cards draggable.
- [ ] Make month day cells droppable.
- [ ] Make day/week time slots droppable.
- [ ] On drop, calculate the new start/end while preserving event duration.
- [ ] Persist the move through Convex mutation.
- [ ] Add optimistic UI where practical.
- [ ] Add keyboard/accessibility behavior if supported by the documented API.

### 6. Drag resize support

- [ ] Add resize handles for day/week timed events.
- [ ] Convert vertical drag delta to time increments.
- [ ] Persist adjusted `startAt`/`endAt` through Convex mutation.
- [ ] Enforce minimum duration.

### 7. Recurring events

- [ ] Recurring events are out of scope for the initial version.
- [ ] Revisit recurrence after one-off event creation, editing, and drag/drop are working.

### 8. Polish and validation

- [ ] Add loading and empty states.
- [ ] Add error handling for failed mutations.
- [ ] Add current-time indicator for day/week views.
- [ ] Highlight today.
- [ ] Ensure protected route matching includes all calendar app paths.
- [ ] Run validation:
  - `bun run lint`
  - `bunx tsc --noEmit`
  - `rg "asChild" . --glob '!node_modules/**' --glob '!.next/**'`

## Open decisions

- [x] Use `/calendar` as the main calendar route.
- [x] Do not include recurring events in the initial version.
- [x] Use a single calendar in the initial version, with optional event color.
- [x] Use Sunday as the week start day.
