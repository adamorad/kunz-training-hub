# Kunz Training Hub: design

## Goal
Kunz is a volunteer-run hackerspace. Some tools need training before use. The hub shows who can train what, lets trainers post training sessions, lets members sign up, and keeps a short guide for each tool. Training happens in person at the space; the hub only coordinates it.

## Abuse (it's a hackerspace: assume people will poke at it, and the code is public)
- Joining needs the **space code** (env `SPACE_CODE`), printed on a QR code at Kunz: you have to have been there. Rotating it doesn't log anyone out.
- "Can train" is only a claim. A **key-holder verifies** each person per tool (`verified` on the answer) before they can post sessions or edit that tool's guide.
- **Key-holders** (env `KEYHOLDER_CODE`) use `/admin`: verify trainers, delete answers and sessions, undo the latest guide edit. Guides keep every version.
- Telegram handles are only returned to members and key-holders. Edit keys travel in headers or bodies, never in URLs.
- Caps: 500 answers, 500 sessions, 12 seats, text lengths; a honeypot field; manual links must be http(s); React escapes all text.
- Secrets live only in Vercel env vars, never in the repo. Found a hole? See SECURITY.md.

## Identity
There are no accounts. Submitting the form creates an answer (`responses/<id>.json`) with a random token; the browser keeps `{id, token}` in localStorage. Every write after that sends `{id, token}`. The server hashes the token and compares it with the stored hash.
- A **trainer for tool X** is an answer with `tools[X] === "train"` that a key-holder verified for X.
- Losing the browser storage means making a new answer. Acceptable for a hackerspace; key-holders can delete the old answer at /admin.

## Data (Vercel Blob, private, one JSON file per record)
- `responses/<id>.json`: handle, contact, willTrain, tools, other, tokenHash.
- `sessions/<id>.json`: toolId, trainer (response id + handle + contact), when (ISO, Israel time entered by the trainer), seats (1-12), note, createdAt.
- `signups/<sessionId>/<responseId>.json`: handle, contact, at. One file per signup so two people signing up at once can't overwrite each other. A full session refuses new signups (checked by counting files; a rare race can add one extra seat, acceptable).
- `guides/<toolId>/<timestamp>.json` (latest wins): checklist (up to 12 short lines), safety (text), manual (http(s) URL), updatedBy, updatedAt.
- Non-production environments write under `<VERCEL_ENV|local>/`.

## Rules
- Create a session: a verified trainer for that tool. Cancel: the trainer who posted it, or a key-holder. Signups are deleted before the session.
- Join or leave: anyone with an answer. A trainer can't sign up to their own session. No joining past sessions or full sessions.
- Upcoming = `when` later than 2 hours ago. Past sessions are hidden (kept in storage).
- Edit a guide: only trainers for that tool. Everyone can read it.
- All text is trimmed and length-capped on the server; the manual link must be http(s).

## Pages
- Five tabs in a bottom bar on every page, each a real route: `/` You (hero and form), `/sessions`, `/trainers`, `/tools`, `/ideas` (vote on what to build next). Old `/#tools`-style links redirect.
- A footer on every page: source code, key-holders (`/admin`), and for members the answers export.
- `/admin`: key-holders.
- `/tools/[id]`: the tool's guide, upcoming sessions (join, leave, or create if you are a trainer), and the people (can train, trained, want to learn).

## UI
- Mobile first, with motion patterns in the spirit of 60fps.design: a bottom tab bar, segmented controls with a sliding thumb, bottom sheets, toasts, spring presses, staggered entrances (all off under prefers-reduced-motion).
- Design language follows The Directory (Israel Startup Directory, docs/design.md there): Inter 400/500/600, cards with 24px radius and a soft shadow on a page with a faint grid, hairlines, one lime primary button per view, status colours as small dots plus text (green = can train, blue = trained, amber = wants to learn).
- Dark by default. A header toggle switches to light and is remembered (localStorage `kunz-theme`, applied by an inline script before paint).
- English and Hebrew: a header toggle (localStorage `kunz-lang`) switches strings and sets `lang`/`dir` on `<html>`. Tool names have both languages. Layout uses logical CSS properties so RTL works.

## Ideas (not now)
Detailed plans for the Training Hub's parked ideas and ten more modules for the space (open now, parts finder, tool status, wishlist, workshop tickets, dues, project wall, key-holder rota, door sensor, laser RFID): [docs/ideas/](ideas/README.md).
