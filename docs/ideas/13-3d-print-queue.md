# 13. 3D print queue

## Problem
The printers are shared and prints take hours. People don't know if a printer is free, whose print is on the bed, or when theirs is done.

## What it does
- A queue per printer: who, what, estimated time, material.
- 'Start' and 'Done' buttons for whoever is at the printer; the next person sees the bed is free.
- A message (in the app, later Telegram) when your print is done or failed.
- Later: read status straight from the printer if it runs OctoPrint or Klipper/Moonraker (check what Kunz's printers run).

## Data
`prints/<printerId>/<id>.json`: `{ by, file?, estimateMin, material, grams?, state: queued|printing|done|failed|removed, at }`.

## API
`GET /api/prints` (members). `POST /api/prints` (members). `POST /api/prints/<id>/state` (owner, trained members for that printer, key-holders).

## UI
A Printers screen: each printer's current job with a progress estimate, then the queue. 'My prints' at the top. Pads on the circuit board can show printing.

## Abuse and privacy
Only trained members (from the hub) can queue on a printer. One active job per member per printer.

## Steps
1. Tests: queue order, trained-only rule, one active job.
2. API and screen.
3. Notification on done.
4. Optional OctoPrint/Moonraker integration after checking the printers.

## Effort and dependencies
A weekend. Depends on: Training hub (built).
