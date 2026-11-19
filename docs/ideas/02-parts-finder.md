# 2. Parts and tools finder

## Problem
"Where's the hot glue gun?" "Do we have M3 screws?" The about page jokes about "a drawer of unlabelled cables". Finding things wastes time, and new members don't know what the space has.

## What it does
- Every storage spot (drawer, shelf, bin, cabinet) gets a short code like `D14` and a QR sticker.
- Scanning the sticker opens that spot: a photo of what's inside, a list of items, and "last checked by noa, 2 weeks ago".
- A search box: "glue" finds the hot glue gun in `C3` and glue sticks in `D07`, with the photo and a small map of the room.
- "Running low" flag on consumables (solder, filament, screws), which can feed the wishlist (plan 4).
- Ties into "name a drawer" (150 ILS on the donate page): a sponsored drawer shows its sponsor's name.

## Data
- `places/<code>.json`: `{ code, name, area: "fab" | "bench" | "kitchen" | "lounge" | ..., photo?, items: [{ name, qty?, low?: boolean, toolId? }], sponsor?, checkedBy, checkedAt }`.
- Photos in Blob under `photos/places/<code>/<uuid>.jpg`, compressed in the browser to 1600 px JPEG (the same approach as Food Quest).
- A simple room map: one SVG floor plan in the repo with each spot's code at its position (draw once from the about page's schematic plus a visit).

## API
- `GET /api/places` (members: everything; public: names and areas only, no photos).
- `GET /api/places/<code>`.
- `PUT /api/places/<code>`: any member can update items and the photo; every version kept (like guides) and key-holders can undo.
- `POST /api/photo`: member upload, size-capped.

## UI
- A "Find" screen with search at the top and areas as chips (fab corner, bench, lounge, kitchen).
- Spot page: photo, items with a "low" toggle, "I checked this" button that bumps `checkedAt`, sponsor line.
- Print view at `/places/print`: a sheet of QR labels with codes, for the label printer or plain paper.

## Running it at the space
- A "label night": members pair up, take one area each, photograph, list, stick labels. The app is built in advance so the evening is about the space, not the code.

## Abuse
- Members only for edits, versions kept, key-holder undo. Photo uploads capped (size and count per member per day).

## Steps
1. Data model and tests (search ranking, low-stock list).
2. API with versions and photo upload.
3. Find screen, spot page, QR print sheet.
4. Floor plan SVG.
5. Label night.

## Effort
A weekend of code, one evening at the space.
