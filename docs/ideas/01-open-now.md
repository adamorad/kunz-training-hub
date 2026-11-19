# 1. Open now

## Problem
Nobody knows for sure when the space is open. The website, the about page and Telegram disagree (Wednesday or Thursday), and people turn up to a locked door.

## What it does
- A big "Open now" or "Closed" state at the top of the hub, with who opened it and since when ("Open since 19:10, noa").
- A key-holder (or anyone a key-holder allows) taps **Open** when they arrive and **Close** when they leave. Optional "until about 23:00".
- The usual weekly hours are shown under it ("Usually: Thursday from 19:00"), edited by key-holders, so the answer is in one place.
- A public SpaceAPI endpoint so Kunz shows up on hackerspace maps and status widgets.
- Later the door sensor (plan 9) sets the state on its own; the button stays as a manual override.

## Data
- `state/current.json`: `{ open: boolean, since: ISO, by: handle, until?: "HH:MM", source: "button" | "sensor" }`.
- `state/log/<timestamp>.json`: one file per change, for "how often were we open this month".
- `state/hours.json`: `[{ day: 0-6, from: "19:00", to?: "23:59", note? }]`, key-holders only.

## API
- `GET /api/state`: current state and hours (public, cached 30 s).
- `POST /api/state` `{ open, until? }`: a member whose answer has `canOpen: true`, or a key-holder. `canOpen` is a new flag key-holders set in `/admin` (the people who actually hold keys).
- `GET /api/spaceapi.json`: SpaceAPI document built from `state/current.json` and fixed space info (name, logo, address, Telegram, website). Check the current schema at spaceapi.io before building and pin the version.

## UI
- A status pill in the header next to the logo (green dot "Open", grey "Closed"), visible on every tab.
- On the You tab, above the circuit: a card with the state, since, by whom, and the weekly hours.
- For people with `canOpen`: one large Open/Close button in that card, with a toast and an undo for 5 seconds.
- Hebrew and English strings; times always in Israel time.

## Abuse
- Only `canOpen` members and key-holders can change the state; everything is logged with the handle.
- Auto-close at 04:00 if nobody closed it (a daily Vercel cron), so a forgotten "open" doesn't lie all week.

## Telegram (optional, small)
- When the state changes, post "Kunz is open (noa)" to the group through a bot token in env. This is the first step of the parked Telegram bot.

## Steps
1. Tests for the state rules (who may change it, auto-close time, hours formatting).
2. Store, API and the SpaceAPI document.
3. Header pill and the You-tab card; `canOpen` toggle in `/admin`.
4. Daily auto-close cron (`vercel.ts` crons).
5. Add Kunz to the SpaceAPI directory (needs key-holder OK).

## Effort
An evening. No hardware.
