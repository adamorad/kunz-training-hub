# Kunz Training Hub

Who can train what at [Kunz](https://kunz.im), the hackerspace in Givatayim. Members say what they know, what they want to learn and whether they'd teach. Trainers post sessions, members sign up, and each tool has a short guide. Training itself happens in person at the space.

Live: https://kunz-training.vercel.app

- English and Hebrew, dark and light.
- No accounts: you join with the space code from the wall, and your browser keeps an edit key.
- Key-holders verify trainers and clean up at `/admin`.

How it works, the data model and the abuse rules: [docs/design.md](docs/design.md).

## Run it

```
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3071
npm test
```

Storage is Vercel Blob (private). Local and preview runs write under `local/` or `preview/`, never over production data.

## Change the tool list

`TOOLS` in `lib/training.ts` (English and Hebrew names).

## Contributing

Pull requests welcome. Found a security hole? Read [SECURITY.md](SECURITY.md) first.

MIT licensed.
