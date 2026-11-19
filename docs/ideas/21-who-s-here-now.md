# 21. Who's here now

## Problem
People decide whether to come based on who'll be there, and asking in Telegram every time is awkward.

## What it does
- Members tap 'I'm here' (or it happens through the guestbook check-in) and appear on a 'Here now' list with what they're working on.
- Auto check-out after 5 hours or at closing.
- Off by default; nobody shows up without choosing to.

## Data
`here/<responseId>.json`: `{ since, doing? }`, deleted on check-out.

## API
`GET /api/here` (members). `POST/DELETE /api/here` (member, self).

## UI
Avatars in the Open now card ('3 here: noa, eitan, dana'), and a tap-to-check-in button.

## Abuse and privacy
Members only see it, opt-in only, nothing kept after check-out.

## Steps
1. Tests: auto check-out.
2. API and avatars.
3. Hook into the guestbook kiosk.

## Effort and dependencies
An evening. Depends on: Open now.
