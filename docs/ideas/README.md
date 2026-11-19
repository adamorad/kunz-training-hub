# Ideas for Kunz

Plans for what could grow out of the Training Hub. Members vote on them at https://kunz-training.vercel.app/ideas. None of this is built yet. Each plan reuses what the hub already has, so the hub becomes one open-source "Kunz app" instead of a pile of separate sites.

## What every module reuses

- **Members**: an answer in `responses/<id>.json` with an edit key in the browser. Joining needs the space code from the wall (`SPACE_CODE`).
- **Key-holders**: `KEYHOLDER_CODE`, the `/admin` page, and `isKeyholder(req)` in `lib/auth.ts`.
- **Storage**: private Vercel Blob, one JSON file per record, non-production under `<env>/` (`lib/store.ts`).
- **UI**: the bottom tab bar, cards, segmented controls, sheets, toasts, Hebrew/English, dark/light (`app/ui.tsx`, `app/globals.css`, `lib/i18n.ts`).
- **Rules**: assume people will poke at it. Every write is a member or key-holder action, capped, validated on the server, and tested in `lib/*.test.ts`.

If a module needs a fifth tab, the tab bar becomes "You, Sessions, Space, More", with the rest under More.

## The plans

| # | Idea | Who it's for | Effort | Depends on |
|---|---|---|---|---|
| 1 | [Open now](01-open-now.md) | everyone, weekly | S | - |
| 2 | [Parts and tools finder](02-parts-finder.md) | members at the space | M | - |
| 3 | [Tool status and fault log](03-tool-status.md) | members, trainers | S | - |
| 4 | [Wishlist with live progress](04-wishlist.md) | members, visitors, donors | M | a payment link |
| 5 | [Workshop tickets](05-workshop-tickets.md) | the public, teachers | L | a payment provider |
| 6 | [Dues tracker](06-dues.md) | key-holders | M | - |
| 7 | [Project wall](07-project-wall.md) | members, visitors | M | - |
| 8 | [Key-holder rota](08-keyholder-rota.md) | key-holders | S | 1 helps |
| 9 | [Door sensor build night](09-door-sensor.md) | members who solder | M (hardware) | 1 |
| 10 | [Laser RFID lock build night](10-laser-rfid.md) | the laser's trainers | L (hardware) | verified trainers (built) |


## More ideas (added 2026-11-19)

| # | Idea | Area | Effort | Depends on |
|---|---|---|---|---|
| 11 | [Events calendar](11-events-calendar.md) | community | M | - |
| 12 | [Lightning talks](12-lightning-talks.md) | learning | S | Events calendar helps |
| 13 | [3D print queue](13-3d-print-queue.md) | space | M | Training hub (built) |
| 14 | [Tool time booking](14-tool-time-booking.md) | space | M | Training hub (built) |
| 15 | [Power dashboard](15-power-dashboard.md) | hardware | M | Door sensor night (shared crew) |
| 16 | [Air quality monitor](16-air-quality-monitor.md) | hardware | M | - |
| 17 | [Lending library](17-lending-library.md) | community | S | Parts finder (QR labels) helps |
| 18 | [Skill swap](18-skill-swap.md) | learning | S | - |
| 19 | [New member onboarding](19-new-member-onboarding.md) | community | M | - |
| 20 | [Digital guestbook](20-digital-guestbook.md) | space | S | - |
| 21 | [Who's here now](21-who-s-here-now.md) | community | S | Open now |
| 22 | [Find collaborators](22-find-collaborators.md) | community | S | Skill swap helps |
| 23 | [Honesty shop](23-honesty-shop.md) | money | S | Wishlist payment link decision |
| 24 | [Material usage log](24-material-usage-log.md) | money | S | Print queue, honesty shop |
| 25 | [Monthly build challenge](25-monthly-build-challenge.md) | community | S | Project wall |
| 26 | [Space wiki](26-space-wiki.md) | learning | M | - |
| 27 | [Closing checklist](27-closing-checklist.md) | space | S | Open now |
| 28 | [Sponsors and partners](28-sponsors-and-partners.md) | money | S | Wishlist helps |
| 29 | [Open house sign-up](29-open-house-sign-up.md) | community | S | Events calendar |
| 30 | [E-ink door sign](30-e-ink-door-sign.md) | hardware | M | Open now, events calendar |

Effort: S is an evening, M is a weekend, L is several sessions.

## Suggested order

1. **Open now** and **Tool status**: small, used every week, and both light up things that already exist (the site, the circuit board).
2. **Wishlist**: goes straight at the monthly deficit.
3. **Door sensor build night**: the first hardware evening, which feeds Open now.
4. **Parts finder**, then **Project wall**: they need members to photograph drawers and projects, so run them as a "label night" and a "show and tell".
5. **Key-holder rota** and **Dues**: when key-holders ask for them.
6. **Workshop tickets** and **Laser RFID**: the biggest, so last, once the rest has earned trust.

## Training Hub ideas parked earlier

- Sign-off after a session: the trainer marks who passed and they move to Trained.
- Telegram bot: "who can train me on the laser?", new session posts, nudges when people wait on a tool.
- A QR sticker on each tool that opens its page.
- Train-the-trainer: a trained member asks to become a trainer; a trainer or key-holder approves.
- "Ask a trainer": one tap on a tool with people waiting sends trainers a request.
- Photos in guides, and a thanks counter for trainers.
- Make the whole app forkable by other hackerspaces (one config file for name, tools and colours) and add good-first-issues.
