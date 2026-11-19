# 24. Material usage log

## Problem
Filament and resin run out without warning and nobody knows how fast they're used or by whom.

## What it does
- When a print finishes (print queue) or after a laser job, log material and amount.
- Stock levels per spool or bottle go down; 'running low' feeds the wishlist and parts finder.
- Monthly use per member, visible to the member, can be paid through the honesty shop.

## Data
`materials/<id>.json` (spools and bottles with remaining grams), `usage/<YYYY-MM>/<id>.json`.

## API
`POST /api/usage` (members). `GET /api/materials` (members).

## UI
A one-step 'how much did you use?' prompt after a print, with the slicer's estimate prefilled.

## Abuse and privacy
Members only; key-holders correct stock.

## Steps
1. Tests: stock math, low threshold.
2. Prompt and stock screen.
3. Connect to print queue and shop.

## Effort and dependencies
An evening. Depends on: Print queue, honesty shop.
