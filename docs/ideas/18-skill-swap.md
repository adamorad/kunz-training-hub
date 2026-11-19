# 18. Skill swap

## Problem
The hub covers tools, but most help at a hackerspace is about skills: debugging code, designing a PCB, choosing a motor.

## What it does
- Members add skills as tags with a level (learning, can help, can teach).
- Search 'kicad' or 'esp32' to find who can help, with Telegram for members.
- 'I want to learn' on a skill groups people for a workshop idea.

## Data
Extends the answer: `skills: [{ tag, level }]`, tags lowercased, max 15 per member.

## API
`GET /api/skills?q=` (members). Edited through the existing answer form.

## UI
A Skills section in the You form (tag input with suggestions), and a search screen grouped by skill.

## Abuse and privacy
Members only, tag length and count caps.

## Steps
1. Tests: tag normalisation, search.
2. Form field and search screen.

## Effort and dependencies
An evening. Depends on: -.
