# Ideas for Kunz

Plans for what could grow out of the Training Hub. None of this is built yet. Each plan reuses what the hub already has, so the hub becomes one open-source "Kunz app" instead of a pile of separate sites.

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
