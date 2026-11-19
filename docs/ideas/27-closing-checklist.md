# 27. Closing checklist

## Problem
Leaving the laser chiller on or a window open happens, and nobody knows who closed last.

## What it does
- A short checklist on a QR by the door, one tap per item.
- Completing it sets Open now to closed and logs who closed.
- Missed items (for example 'laser off' unticked) message key-holders.

## Data
`closings/<YYYY-MM-DD>.json`: `{ by, items: { id: boolean }, at }`. Items in config.

## API
`POST /api/closing` (members with `canOpen`, or key-holders).

## UI
Big tappable list with a satisfying final 'Closed' state; shows tonight's closer on the rota.

## Abuse and privacy
Only people allowed to open can close.

## Steps
1. Agree the items with key-holders.
2. Checklist page, Open now hook.
3. Alert on missed items.

## Effort and dependencies
An evening. Depends on: Open now.
