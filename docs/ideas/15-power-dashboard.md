# 15. Power dashboard

## Problem
Electricity is a fixed monthly cost (about 400 ILS on kunz.im), but nobody knows what uses it or whether the laser chiller was left on all weekend.

## What it does
- A non-invasive current clamp on the main feed, read by an ESP32 (ESPHome) and sent to the hub.
- Live watts, today's kWh, and this month's estimated cost on a small dashboard.
- An alert if the space draws a lot while marked closed (something left on).
- 'Sponsor a watt' on the wishlist shows real numbers.

## Data
`power/<YYYY-MM-DD>.json`: 5-minute averages. Tariff per kWh in config.

## API
`POST /api/power` (device token). `GET /api/power?days=` (members).

## UI
A small chart on a Space screen (line of today, bars of the month). Built with the dataviz rules: one series, clear units.

## Abuse and privacy
Device token only writes. Data is about the building, not people.

## Steps
1. Electrical safety: clamp only, installed by someone qualified, no work inside the panel by volunteers.
2. Hardware build night with the door sensor crew.
3. Endpoint and chart.
4. 'Left on' alert with Open now.

## Effort and dependencies
A weekend. Depends on: Door sensor night (shared crew).
