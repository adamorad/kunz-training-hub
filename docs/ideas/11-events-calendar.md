# 11. Events calendar

## Problem
The kunz.im calendar is stuck on April 2026 and its iCal and RSS links go nowhere. Events live in Telegram messages that scroll away.

## What it does
- One list of upcoming events: open nights, workshops, training sessions (pulled from the hub), hack days, lightning-talk nights, the roof film night.
- Recurring events (every Thursday 19:00) defined once, with exceptions for holidays.
- An iCal feed members add to their phone calendar, so changes show up on their own.
- Event page with time, place, what to bring, and a 'going' count.

## Data
`events/<id>.json`: `{ title, titleHe, kind, start, end?, repeat?: { weekday, until }, skip?: date[], note, by }`. `going/<eventId>/<responseId>.json`.

## API
`GET /api/events?from=&to=` (public, recurring events expanded). `GET /api/events.ics` (public feed). `POST /api/events` (key-holders and verified trainers for their sessions). `POST /api/events/<id>/going` (members).

## UI
An Events screen with this week and next, grouped by day. Subscribe button that copies the iCal link or opens it in the phone's calendar. Training sessions appear automatically.

## Abuse and privacy
Only key-holders create general events. Feed has no personal data.

## Steps
1. Tests: recurrence expansion across DST and holiday skips, iCal output validates.
2. Store, API, feed.
3. Events screen and event page.
4. Point kunz.im's calendar link to the feed (ask whoever runs kunz.im).

## Effort and dependencies
A weekend. Depends on: -.
