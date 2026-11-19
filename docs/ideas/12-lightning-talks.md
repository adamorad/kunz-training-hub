# 12. Lightning talks

## Problem
kunz.im invites members to give 10-minute lightning talks, but there's no way to sign up or see who's speaking.

## What it does
- A talks night (from the events calendar) with up to 8 slots.
- Members claim a slot with a title and one line; the order is shown to everyone.
- Speakers add a link to slides or a repo afterwards, building an archive of past talks.
- A big-screen 'running order' view with a 10-minute timer for the night itself.

## Data
`talks/<nightId>/<responseId>.json`: `{ title, blurb, link?, order, at }`.

## API
`GET /api/talks?night=` (public). `POST /api/talks` (members, one per night). Key-holders reorder or remove.

## UI
A night page with slots, a 'Give a talk' sheet, a past talks archive, and `/talks/live` for the projector with a large timer that turns amber at 8 minutes and red at 10.

## Abuse and privacy
Members only, one talk per member per night.

## Steps
1. Tests: slot cap, one per member, ordering.
2. API and night page.
3. Projector view with timer.
4. First talks night.

## Effort and dependencies
An evening. Depends on: Events calendar helps.
