# 16. Air quality monitor

## Problem
Resin printing and laser cutting release fumes and particles in a small, ventilated room. Nobody can see when the air is bad.

## What it does
- An ESP32 with a particle sensor (PM2.5) and a VOC or CO2 sensor in the fab corner.
- Live readings on the tool pages of the laser and resin printer, and a light by the door: green, amber, red.
- A 'turn on the extractor' prompt when levels rise, and a log to check whether the ventilation is enough.

## Data
`air/<YYYY-MM-DD>.json`: 1-minute readings. Thresholds in config, with sources for them noted in the plan before building.

## API
`POST /api/air` (device token). `GET /api/air` (public current, members history).

## UI
A small air card on the laser and resin tool pages and on the Space screen; red state also shows in the header.

## Abuse and privacy
Device token only writes.

## Steps
1. Choose sensors (research which low-cost sensors are reliable for VOCs; PM2.5 sensors are well understood).
2. Build night.
3. Endpoint, cards, door light.
4. Review thresholds with readings from a few weeks.

## Effort and dependencies
A weekend. Depends on: -.
