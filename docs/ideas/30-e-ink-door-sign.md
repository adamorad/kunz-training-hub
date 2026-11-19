# 30. E-ink door sign

## Problem
People arriving downstairs can't tell if the space is open or what's on tonight.

## What it does
- An ESP32 with an e-paper display by the buzzer, refreshing every few minutes from the hub.
- Shows Open or Closed, who's opening tonight, and the next event, in Hebrew and English.
- Runs for weeks on a battery, since e-paper only uses power when it changes.

## Data
No new data: reads `GET /api/sign`, a compact summary built from Open now, rota and events.

## API
`GET /api/sign` (public, tiny JSON or a pre-rendered 1-bit image for simple firmware).

## UI
Design the sign layout for the panel's resolution, with large type readable from two meters.

## Abuse and privacy
Read-only, public data.

## Steps
1. Pick a display and check Hebrew font rendering on it (or render on the server as an image).
2. Endpoint.
3. Build night, weatherproof case if outside.

## Effort and dependencies
A weekend. Depends on: Open now, events calendar.
