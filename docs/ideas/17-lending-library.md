# 17. Lending library

## Problem
The bookshelf and some hand tools could go home with members, but things borrowed without a note never come back.

## What it does
- A catalogue of lendable items (books, the multimeter, the crimping tool) with photos.
- Borrow by scanning the item's QR code; return the same way.
- Due dates (two weeks by default) and a reminder; overdue items visible to key-holders.
- Members can add their own items to lend to others.

## Data
`items/<id>.json`: `{ name, kind, photo?, owner: 'kunz' | responseId, lendable }`. `loans/<itemId>.json`: current loan `{ by, from, due }`; history in `loans/<itemId>/log/`.

## API
`GET /api/items` (members). `POST /api/items/<id>/borrow` and `/return` (members).

## UI
A Library screen with search and 'Out' or 'Here' tags; 'My loans' at the top with due dates.

## Abuse and privacy
Members only, max 3 loans each, key-holders can mark items lost.

## Steps
1. Tests: one loan per item, due dates, caps.
2. API and screen, QR labels (reuses the parts finder print sheet).
3. Catalogue night with the bookshelf.

## Effort and dependencies
An evening. Depends on: Parts finder (QR labels) helps.
