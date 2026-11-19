# 8. Key-holder rota

## Problem
Key-holders rotate monthly (kunz.im). Who holds the keys this month, who opens on Thursday, and who covers when someone is sick lives in people's heads and chats.

## What it does
- A rota for key-holders: this month's key-holders and, per open night, who opens and who closes.
- Swaps: "Can someone take Thursday 27th?" shows up for the other key-holders, one taps "I'll take it", the rota updates.
- Members see who's opening tonight on the Open now card (plan 1): "Opening tonight: noa".
- A reminder to the person on duty the afternoon before (in-app first; Telegram with the bot).

## Data
- `rota/<YYYY-MM>.json`: `{ keyholders: responseId[], nights: [{ date, opens?: responseId, closes?: responseId }] }`.
- `swaps/<id>.json`: `{ date, role: "opens" | "closes", from, takenBy?, at }`.
- Key-holders are a list in `/admin` (responses marked `keyholder: true`), separate from the shared `KEYHOLDER_CODE`, so each action has a name. This is also the step away from one shared code toward per-person key-holder access.

## API
- `GET /api/rota?month=` (members: names for tonight only; key-holders: full month).
- `POST /api/rota` (key-holders): assign, request swap, take swap.

## UI
- In `/admin` (or a Key-holders tab for those flagged): month calendar, tap a night to assign, swap requests at the top.
- Open now card: "Opening tonight" line.

## Steps
1. Mark individual key-holders in `/admin`; authenticate key-holder actions by member identity plus the flag.
2. Tests: swap flow, one person per role per night.
3. API and calendar UI.
4. Reminders.

## Effort
An evening or two.
