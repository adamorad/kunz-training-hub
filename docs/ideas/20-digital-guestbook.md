# 20. Digital guestbook

## Problem
kunz.im mentions a paper logbook at the door. It's hard to read later, and in an emergency nobody knows who is inside.

## What it does
- A kiosk page on an old tablet by the door: visitors type a first name and who invited them (optional).
- Members tap their handle to check in.
- A 'who's inside right now' count for key-holders (for safety), cleared at closing.
- Visitors can leave a Telegram handle to be invited to the group.

## Data
`visits/<YYYY-MM-DD>/<id>.json`: `{ name, kind: guest|member, invitedBy?, in, out? }`. Deleted after 30 days.

## API
`POST /api/visits` (kiosk token or member). `GET /api/visits/today` (key-holders).

## UI
`/kiosk`: huge buttons, works in landscape, no keyboard surprises, resets after each sign-in.

## Abuse and privacy
Kiosk token only signs in; reading needs a key-holder. Short retention.

## Steps
1. Tests: retention, today count.
2. Kiosk page and admin view.
3. Mount a tablet.

## Effort and dependencies
An evening. Depends on: -.
