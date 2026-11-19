# 23. Honesty shop

## Problem
Members use consumables (filament, solder, kits, snacks, coffee) that cost the space money, and there's no easy way to pay a few shekels.

## What it does
- A price list on a QR code at the shelf: filament per 100 g, solder per meter, kits, coffee.
- Pick items, see the total, pay with a PayBox or Bit link.
- Members can also log what they took and settle monthly.
- Totals feed the wishlist's monthly bar.

## Data
`shop/items.json` (key-holders), `shop/sales/<YYYY-MM>/<id>.json`: `{ items, total, by?, method, confirmed }`.

## API
`GET /api/shop` (public). `POST /api/shop/sale` (anyone, returns payment link). Key-holders confirm.

## UI
A shop page with big tap targets, a running total and the pay button; works one-handed while holding the item.

## Abuse and privacy
Unconfirmed sales are only intentions; key-holders reconcile with the payment app.

## Steps
1. Price list with key-holders.
2. Tests: totals, monthly report.
3. Shop page, QR at the shelf.

## Effort and dependencies
An evening. Depends on: Wishlist payment link decision.
