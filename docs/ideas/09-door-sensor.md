# 9. Door sensor build night

## Goal
The door tells the hub whether the space is open, so Open now (plan 1) is true without anyone pressing a button. Built by members in one evening; the software side is ready before the evening.

## Hardware (about 50-100 ILS)
- An ESP32 dev board (Wi-Fi), a magnetic reed switch on the door or on the lock's bolt, a USB power supply, a small 3D-printed or laser-cut case (made at Kunz).
- Optional: a status LED by the door (green when the hub says open), and a second switch for the lights if "door closed but people inside" is common.
- Sensing the **lock bolt** is better than the door: an unlocked door means someone with keys is there.

## Firmware
- ESPHome (YAML, no C++ needed), so non-programmers can follow along and change it later. A binary sensor on the reed switch, with debounce, and an `http_request` POST to the hub on change plus a heartbeat every 5 minutes.
- The YAML lives in this repo under `hardware/door/`, with wiring photos and a parts list.

## Hub side
- `POST /api/state/sensor` `{ open, uptime }` with a device token in a header (`DOOR_TOKEN` env var, never in the YAML committed to git; ESPHome reads it from `secrets.yaml`, which is gitignored).
- Sets `state/current.json` with `source: "sensor"`. A manual Close from a key-holder wins for 30 minutes (for "door open, but we're closing").
- If no heartbeat for 15 minutes, the hub shows "Status unknown" instead of guessing, and pings key-holders.

## The evening
1. Intro (10 min): what we're building and why.
2. Pairs: one solders the switch leads, one flashes ESPHome from a laptop.
3. Case: print or cut it during the evening.
4. Mount it, test with the hub on the big screen: open the door, watch the pad turn green.
5. Everyone who helped gets credited on the hub's About.

## Safety and privacy
- The sensor only reports open or closed. No camera, no microphone, no presence of individuals.
- The device token can only change the open state.

## Steps
1. Plan 1 shipped with the sensor endpoint.
2. Parts bought (or donated from the drawers).
3. ESPHome config and wiring diagram in `hardware/door/`.
4. Build night.

## Effort
Software: an evening. Hardware: one build night.
