# 25. Monthly build challenge

## Problem
Members come for a few weeks, then drift. A shared goal gives a reason to come back.

## What it does
- A theme announced on the first of the month ('blinky things', 'under 50 shekels', 'make it move').
- Entries posted to the project wall with the challenge tag.
- Show-and-tell on the last open night, then member votes; winners get a drawer named after them for a month.

## Data
`challenges/<YYYY-MM>.json`: `{ theme, themeHe, deadline }`. Entries are project wall posts with `challenge`. Votes like the ideas page.

## API
`GET /api/challenges/current`. Votes reuse the voting module.

## UI
A banner on the You tab with the theme and days left; an entries gallery.

## Abuse and privacy
Members only vote, one vote each per challenge, no voting for yourself.

## Steps
1. Pick themes for three months with key-holders.
2. Banner and gallery.
3. Voting reuse.

## Effort and dependencies
An evening. Depends on: Project wall.
