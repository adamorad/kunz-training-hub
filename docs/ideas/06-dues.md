# 6. Dues tracker

## Problem
Dues pay about 80% of rent. Key-holders track who paid by hand, chase people in private messages, and can't see the month at a glance.

## What it does
- For key-holders only: a monthly grid of members and whether this month's dues arrived.
- Members see only their own status on the You tab ("Dues: paid for November" or "Not recorded yet for November") with how to pay.
- A key-holder marks payments by hand from the bank statement (the money keeps flowing by bank transfer as today); later a standing order or provider webhook could mark them automatically.
- A friendly reminder on the 5th of the month to members not marked paid (Telegram DM through the bot, or just a banner in the app at first).
- Monthly totals feed the running-costs bar on the wishlist (plan 4).

## Members versus answers
- Today a "member" in the hub is anyone who answered with the space code. Dues need the real membership list: key-holders mark answers as **paying members** in `/admin` (and can add people who never used the hub).

## Data
- `members/<responseId>.json` (key-holders only): `{ paying: boolean, monthly: number, since, note? }`.
- `dues/<YYYY-MM>/<responseId>.json`: `{ amount, paidAt, recordedBy, method }`.

## API
- `GET /api/dues?month=` (key-holders): grid.
- `GET /api/dues/me` (member): own status only.
- `POST /api/admin` actions: mark paid, undo, set paying/monthly.

## UI
- `/admin` Dues section: month picker, list with a toggle per member, totals, "copy reminder list".
- You tab: one quiet line with the member's own status; no one else's.

## Privacy
- Nobody but key-holders sees who paid. Never on the public board, never in exports.
- The repo is public: amounts are data, not code, so nothing personal ends up in git.

## Steps
1. Key-holders confirm the monthly amount and who counts as a paying member.
2. Tests: grid totals, own-status visibility rules.
3. Storage, API, admin section, You-tab line.
4. Reminder banner; Telegram DM later with the bot.

## Effort
A weekend.
