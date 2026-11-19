# 29. Open house sign-up

## Problem
72 square meters fills up fast. A public visit day needs a cap and a way for curious people to register.

## What it does
- Public sign-up for an open house with a seat cap and a short form.
- A reminder the day before and the address with the entrance video.
- Afterwards: 'Want to join?' with the space code given in person.

## Data
`openhouse/<eventId>/<id>.json`: `{ name, contact, at }`, deleted 30 days after.

## API
`POST /api/openhouse/<eventId>` (public, honeypot, rate limit). Key-holders see the list.

## UI
A public page in Hebrew and English with date, what to expect, and the sign-up sheet.

## Abuse and privacy
Public form protections; personal data kept briefly and visible only to key-holders.

## Steps
1. Tests: cap, retention.
2. Page and admin list.
3. First open house.

## Effort and dependencies
An evening. Depends on: Events calendar.
