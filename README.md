# Coworking Space Booking System — Backend

A MERN-stack booking system for coworking spaces (desks, meeting rooms) built to solve a real concurrency problem: **preventing double-bookings when multiple users try to reserve the same slot at the same time.**

## The Problem

Most booking-system tutorials check availability with a `find()`, then `insert()` if the slot looks free. Under real concurrent traffic, two requests can both pass the availability check before either one writes — resulting in two confirmed bookings for the same resource and time slot.

## The Solution

- A **compound unique index** on `{ resourceId, startTime }`, scoped with a `partialFilterExpression` so only `status: 'confirmed'` bookings are constrained — this allows a cancelled slot to be legitimately rebooked without the old (cancelled) document blocking it.
- **MongoDB transactions** wrap every booking write, so a rejected write cleanly rolls back instead of leaving partial state.
- **Automatic retry with backoff** on transient write conflicts (MongoDB error code `112`), distinguishing infrastructure-level contention from a genuine duplicate-key rejection (error code `11000`).
- **Waitlist promotion**: on cancellation, the next waitlisted user for that slot is automatically promoted to a confirmed booking and notified by email.

## Proof — Load Test

`scripts/loadTest.js` fires 20 concurrent booking requests at the exact same resource + time slot using real seeded users and `Promise.all`.

```
Succeeded: 1
Failed (correctly rejected): 19
```

The same test was re-run against a slot that had already been booked and cancelled once, confirming the partial index correctly permits rebooking a freed slot while still blocking true duplicates under concurrent load.

## Stack

- Node.js, Express
- MongoDB + Mongoose (transactions, partial unique index)
- JWT authentication
- Brevo HTTP API for transactional email (waitlist promotion notices)

## Folder Structure

```
src/
├── config/       # DB connection, env validation
├── models/       # User, Resource, Booking, Waitlist
├── services/     # Framework-agnostic business logic (bookingService is the core)
├── controllers/   # Thin request/response layer
├── routes/
├── middleware/    # JWT auth, admin guard, centralized error handling
scripts/
└── loadTest.js    # Concurrency proof — run with `node scripts/loadTest.js`
```

## Running Locally

```
npm install
# .env: MONGO_URI, JWT_SECRET, BREVO_API_KEY, SENDER_EMAIL
node server.js
```

## API Overview

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | — | Create account |
| POST | /api/auth/login | — | Get JWT |
| GET | /api/resources | ✓ | List bookable resources |
| POST | /api/resources | ✓ (admin) | Create resource |
| GET | /api/bookings/availability | ✓ | Slot availability for a resource/date |
| POST | /api/bookings | ✓ | Create booking (transaction-safe) |
| DELETE | /api/bookings/:id | ✓ | Cancel booking, triggers waitlist promotion |
| POST | /api/bookings/waitlist | ✓ | Join waitlist for a taken slot |
