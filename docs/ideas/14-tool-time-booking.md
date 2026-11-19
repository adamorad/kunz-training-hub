# 14. Tool time booking

## Problem
Popular tools get crowded on open nights, and people with a long job have no way to reserve time.

## What it does
- Book time slots on tools that need it (laser first), in 30-minute steps.
- Only members trained on that tool can book it.
- A day view per tool showing free and booked time, and 'walk-up' time that can't be booked so newcomers can still try.
- Cancel up to an hour before; no-shows are visible to key-holders.

## Data
`bookings-tools/<toolId>/<date>/<id>.json`: `{ by, from, to, note }`. Bookable tools and walk-up hours in config.

## API
`GET /api/tool-bookings?tool=&date=` (members). `POST` and `DELETE` (trained members, max 2 hours a day per member).

## UI
Tool page gets a 'Book time' strip with today and the next 7 days; tap a free slot, confirm in a sheet.

## Abuse and privacy
Trained-only, daily caps, no overlapping bookings (checked on the server), key-holders can remove.

## Steps
1. Tests: overlap, caps, trained-only, walk-up hours.
2. API and day view.
3. Reminder an hour before.

## Effort and dependencies
A weekend. Depends on: Training hub (built).
