# 3. Tool status and fault log

## Problem
Someone arrives to use the resin printer and it's out of resin, or the laser's lens is dirty, and nobody knew. Faults get mentioned in Telegram and then lost.

## What it does
- Every tool in the hub gets a status: **Working**, **Needs attention** (works with a caveat, like "low filament") or **Out of order**.
- Any member can change it with a short note. The tool page shows the status and the last few changes.
- A fault log per tool: what went wrong, what fixed it. It becomes the "known problems" part of the guide and feeds the safety section.
- On the hub's circuit board, a broken tool's pad turns red, and the Tools tab shows a red tag.

## Data
- `status/<toolId>.json`: `{ state: "ok" | "attention" | "down", note, by, at }`.
- `status/<toolId>/log/<timestamp>.json`: each change, with optional `fix` text when moving back to ok.
- Reuses `TOOLS` from `lib/training.ts`; later the tool list can move to its own config so status works for tools that don't need training (the 3D scanner, the drill press).

## API
- `GET /api/status` (public): all tools' current state.
- `POST /api/status/<toolId>` `{ state, note, fix? }`: members. Rate-limited per member (say 10 changes a day).
- `GET /api/status/<toolId>/log`: last 20 entries.

## UI
- Tool page: a status card at the top with the three-way segmented control for members, the note, and "changed by noa, 3 h ago".
- Tools tab: a status tag on each card; down tools sort first.
- Circuit: a third pad state, red and still (no pulse), with a legend entry.
- "Report a problem" shortcut on the tool page that opens a sheet with the state preset to Out of order.

## Telegram (optional)
- When a tool goes down, post it to the group, so whoever can fix it sees it.

## Abuse
- Members only; every change logged with the handle; key-holders can revert. A tool flipped more than 5 times an hour locks for key-holders only until reset.

## Steps
1. Tests: state transitions, rate limits, circuit state priority (down beats waiting).
2. API and storage.
3. Tool page card and sheet; Tools tab tags; circuit pad colour.
4. Optional Telegram post.

## Effort
An evening.
