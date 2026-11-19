# 19. New member onboarding

## Problem
New members arrive on an open night, nobody shows them where things are, and many don't come back.

## What it does
- A first-week checklist: house rules, where things are, safety basics, Wi-Fi, how to open and close, pick a first training.
- A buddy: an experienced member who said they'd help gets matched and introduced in the app.
- Key-holders see who joined recently and whether they came back.

## Data
`onboarding/<responseId>.json`: `{ done: string[], buddy?: responseId, joinedAt }`. Checklist items in config (Hebrew and English).

## API
`GET/POST /api/onboarding` (member, own). Key-holders: list and assign buddies.

## UI
A card at the top of the You tab for new members until the checklist is done, with progress dots. Buddies see 'You're helping X'.

## Abuse and privacy
Members only. Buddy matching only among members who opted in.

## Steps
1. Write the checklist with key-holders.
2. Tests: progress, buddy matching.
3. Card and admin view.

## Effort and dependencies
A weekend. Depends on: -.
