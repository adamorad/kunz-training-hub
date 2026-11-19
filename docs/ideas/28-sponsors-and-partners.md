# 28. Sponsors and partners

## Problem
Local businesses and companies could support Kunz (parts, equipment, money), but there's no page to point them to or thank them on.

## What it does
- A public page listing sponsors with logos and what they gave.
- Clear sponsor tiers or asks (equipment from the wishlist, monthly support, a workshop sponsor).
- A contact form that reaches key-holders.

## Data
`sponsors/<id>.json` (key-holders), contact messages `sponsor-requests/<id>.json`.

## API
`GET /api/sponsors` (public). `POST /api/sponsor-request` (public, honeypot, rate limit).

## UI
A clean public page meant to be shared with companies; works without the space code.

## Abuse and privacy
Public form protected like the join form; messages only reach key-holders.

## Steps
1. Key-holders agree what Kunz can offer sponsors.
2. Page and form.

## Effort and dependencies
An evening. Depends on: Wishlist helps.
