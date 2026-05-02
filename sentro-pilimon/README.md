# Sentro Pilimon

Sentro Pilimon is a campus announcement and event management platform built with Next.js, Supabase, and Resend. It supports public bulletins, role-based dashboards, channel following, RSVP management, QR scanning, email notification workflows, and admin moderation.

## Core Features

### Public bulletin board
- Landing page with published campus announcements
- Category-based event filtering and rich announcement cards
- Announcement detail pages with event details, venue, timings, organization info, and poster display
- RSVP interaction for `Interested` and `Going`
- Share buttons and QR code support for each announcement

### Channel discovery and personalization
- Channels explorer for:
  - Departments
  - Student councils
  - University organizations
  - Service offices
- Follow/unfollow channel support
- Personalized feed under `/my-feed` showing announcements from followed channels

### Authentication and account management
- PLMun account registration using `@plmun.edu.ph` email addresses
- Login and session handling via Supabase auth
- Email confirmation workflow for new accounts
- Password reset support with Supabase reset tokens
- Sign out from `/auth/signout`

### Role-based dashboards and moderation
- Role-based dashboard routing for `student`, `staff`, `officer`, `moderator`, and `admin`
- Student dashboard redirect to appropriate user experience
- Officer/staff dashboard for announcement creation and management
- Moderator queue for reviewing and approving pending announcements
- Admin dashboard for:
  - User management and role updates
  - Category management
  - Organization/logo management
  - Audit log viewing
  - Published and pending announcement administration

### Announcement publishing workflow
- Announcement creation with:
  - title, description, venue
  - start/end date and time
  - category selection
  - organization or office selection
  - poster upload and client-side cropping/zoom
- Announcement update and archive support
- Submit announcements for approval before publishing

### RSVP and event tracking
- RSVP status selection from announcement details
- `My RSVPs` page for reviewing personal registrations
- RSVP filters for `All`, `Going`, and `Interested`
- RSVP counts shown on announcements
- RSVP check-in and status tracking support in the data layer

### QR scanning and manual link entry
- Camera-based QR scanner at `/scan`
- Manual URL entry fallback for non-camera devices
- Support for navigating to announcement URLs and channel links from QR codes

### Profile and settings
- Profile page showing logged-in account details, role, and email
- Quick access to `My RSVPs` and sign out
- Settings page with timezone preferences and accessibility information

### Notifications and emails
- Resend email integration for:
  - account verification
  - password reset links
  - RSVP confirmation emails
  - announcement approval/rejection notifications
- Fallback behavior logs warnings when email service is not configured

### Analytics and instrumentation
- PostHog analytics support via browser integration
- Custom analytics helpers for page views, events, and user identification

## Technical Notes

### Backend and storage
- Supabase is the primary backend for auth, database, and storage
- Client-side Supabase is created in `lib/supabase/client.ts`
- Server-side Supabase is created in `lib/supabase/server.ts`

### QR and sharing
- QR generation uses a backend API route and client components for download support
- Announcement detail pages support QR code display and poster sharing

### Accessibility and UI
- Responsive layout with mobile-first components
- Accessible patterns and keyboard navigation support noted in `/settings`
- Shared UI primitives include buttons, modals, confirm dialogs, loading skeletons, and empty states

## Installation and local development

```bash
cd sentro-pilimon
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available scripts

- `npm run dev` — run the development server
- `npm run build` — build the app for production
- `npm run start` — start the production build
- `npm run lint` — run ESLint

## Required environment variables

The app uses the following environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` (optional, defaults to `noreply@sentropilimon.com`)
- `NEXT_PUBLIC_POSTHOG_KEY` (optional)

> Note: `RESEND_API_KEY` must be configured for email delivery. If missing or placeholder, the app warns and skips sending email.

## Important notes

- Account registration is restricted to official PLMun email addresses.
- Password reset support depends on Supabase and may require administrator assistance if the reset flow is not configured.
- Role-based access is enforced across dashboard routes.
- QR scanning requires camera permissions and supports manual fallback when a camera is unavailable.
- Admin/moderator features depend on the `role` value stored in Supabase user profiles.

## Directory highlights

- `app/` — Next.js app routes and pages
- `components/` — reusable UI components, dashboard widgets, channels, announcement cards, and modals
- `lib/` — Supabase helpers, email helpers, analytics, and action functions
- `data/` — organization and channel metadata
- `hooks/` — password strength helper
- `types/` — database and application types

## Summary

Sentro Pilimon is a campus-focused announcement system that combines public event discovery with authenticated channel following, RSVP management, QR-powered navigation, and admin moderation. The app is built for PLMun users and supports both public announcement browsing and role-specific workflows for staff, officers, moderators, and administrators.
