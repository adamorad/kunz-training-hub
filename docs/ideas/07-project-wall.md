# 7. Project wall

## Problem
Great things get built at Kunz and disappear into Telegram scroll. Visitors and new members can't see what the space is about, and Instagram has nothing to post.

## What it does
- Members post a project: title, one to six photos, a few lines, the tools they used (from the hub's tool list), optional links (GitHub, files, video).
- A public wall: a photo grid, newest first, filterable by tool. Tool pages show "Made with this tool" from the wall.
- "I want to learn this" on a project links to the tool's training page, so the wall feeds training.
- A monthly "show and tell" at the space where projects get posted together.
- Members can opt in to "OK to share on Kunz's Instagram"; key-holders get a ready-made square image and caption.

## Data
- `projects/<id>.json`: `{ id, title, body, by: responseId, handle, tools: ToolId[], links: string[], photos: string[], shareOk: boolean, at, hidden?: boolean }`.
- Photos in Blob under `photos/projects/<id>/`, compressed client-side.

## API
- `GET /api/projects?tool=` (public: published, not hidden).
- `POST /api/projects`, `PUT /api/projects/<id>`, `DELETE` by the author.
- `POST /api/admin` hide/unhide (key-holders moderate).

## UI
- A Projects screen: masonry-style photo grid on the phone (two columns), large photos on tap with swipe between them.
- Project page: photos, text, tools as tags linking to tool pages, author, links.
- Tool page gets a "Made with this" strip.
- Post sheet: photos first (most important), then title and tools; text optional.

## Abuse
- Members only for posting; caps on projects per member per day and photo size; key-holders hide anything. Links must be http(s) and open with `rel="noopener nofollow"`.

## Steps
1. Tests: tool filter, visibility (hidden, public vs members).
2. Storage, photo upload, API.
3. Wall, project page, post sheet, tool-page strip.
4. Instagram helper (square image render) last.
5. First show-and-tell evening.

## Effort
A weekend, plus an evening at the space.
