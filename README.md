# Kunz Training Hub

A small form for Kunz hackerspace: which tools need training, who can train them, and who wants to learn. Answers show up on a public board.

- Tool list: `lib/training.ts` (edit `TOOLS`).
- Storage: Vercel Blob, one private JSON file per answer. Edits use a token kept in the browser.
- Export everything: `/api/responses?export=1`.

```
npm install
npm run dev   # http://localhost:3071
npm test
```

MIT licensed. Pull requests welcome.
