# 26. Space wiki

## Problem
Practical knowledge (Wi-Fi password, where the breaker is, how to reset the router) lives in a few people's heads.

## What it does
- Short pages members can edit, in Hebrew and English, with history.
- Some pages members-only (Wi-Fi, alarm), others public (how to get here).
- Search, and links from the onboarding checklist.

## Data
`wiki/<slug>/<timestamp>.json`: `{ title, body (markdown), lang, visibility, by }`, latest wins (like guides).

## API
`GET /api/wiki/<slug>`, `PUT` (members), key-holder undo.

## UI
A simple page list and editor with a markdown preview; rendered safely (no raw HTML).

## Abuse and privacy
Members edit, everything versioned, key-holders roll back. Sanitised markdown.

## Steps
1. Tests: visibility, versions, sanitising.
2. Viewer and editor.
3. Seed pages with key-holders.

## Effort and dependencies
A weekend. Depends on: -.
