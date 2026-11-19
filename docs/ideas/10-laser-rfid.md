# 10. Laser RFID lock build night

## Goal
The laser only turns on for members a verified trainer has trained, and it logs minutes of use. Safety first ("the laser is not yours" is already a house rule); per-minute charging becomes possible later. Built by members, on open-source parts.

## Base: dm-mac
- dm-mac (Decatur Makers machine access control, MIT): ESP32 units on each machine running ESPHome, an RFID reader, a relay, and a small Python server for authorization and logging. Its user list is pluggable, which is what lets the hub feed it. https://jantman.github.io/machine-access-control
- Before the build: read its current README and hardware list, and confirm it's maintained. Alternatives to compare if not: RATT (MakeItLabs), ACNode (Leiden), NottingHack's tool boards.

## How the hub feeds it
- The hub already knows who is **trained** (and trainers, verified by key-holders) per tool. Training sign-off (a parked hub idea) should come first, so "trained" is recorded by a trainer rather than self-declared.
- Members register their RFID tag once: tap the tag on the reader in "enroll" mode, then confirm on their phone in the hub. The hub stores `tags/<responseId>.json` `{ uid, at }`.
- An export endpoint `GET /api/access/laser` (device token, never public) returns `{ uids: [...] }` for people trained on the laser. dm-mac's server, or the ESP32 directly, syncs it every few minutes and keeps a local copy so the laser works when Wi-Fi is down.
- Usage logs (`who`, `minutes`) go back to the hub: `POST /api/access/log`. The tool page shows total hours; per-member minutes are visible to that member and key-holders only.

## Hardware
- ESP32, RC522 or PN532 RFID reader, a relay or contactor rated for the laser's supply, an emergency-stop path that never depends on the ESP32, a case.
- **Electrical safety review before mounting**: someone qualified checks the relay rating and wiring on the laser's mains side. The lock must fail safe (no power without a valid tag) and never interfere with the laser's own interlocks.

## The evenings
1. Evening 1: read the dm-mac docs together, order parts, set up the server (it can run on a Raspberry Pi at the space).
2. Evening 2: build the unit on the bench, test with a lamp instead of the laser.
3. Evening 3: electrical review, mount on the laser, enroll the trained members' tags.

## Privacy
- Logs say who used the laser and for how long. Members see their own; key-holders see all; nothing public. Kept for a set time (for example 6 months) agreed with key-holders.

## Steps
1. Training sign-off in the hub (parked idea), so "trained" is trainer-confirmed.
2. Tag enrollment and the access export in the hub, with tests.
3. dm-mac review and parts.
4. Three build evenings, the last with the electrical review.

## Effort
Several sessions, mostly hardware and safety. Needs key-holder approval before anything touches the laser.
