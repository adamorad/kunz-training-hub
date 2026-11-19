# 22. Find collaborators

## Problem
Members have ideas bigger than one person and others are looking for something to work on. The two rarely meet.

## What it does
- Post an idea with what's needed (skills, tools, time).
- Others tap 'I'm in'; the poster sees who and their Telegram.
- Ideas that start get moved to the project wall when done.

## Data
`collab/<id>.json`: `{ title, body, needs: string[], by, status: open|started|done }`, `collab/<id>/in/<responseId>.json`.

## API
`GET/POST /api/collab` (members). `POST /api/collab/<id>/in`.

## UI
A board of open ideas with needs as tags matching the skill swap tags.

## Abuse and privacy
Members only, caps per member, key-holders hide.

## Steps
1. Tests: status flow.
2. Board and post sheet.
3. Link to project wall.

## Effort and dependencies
An evening. Depends on: Skill swap helps.
