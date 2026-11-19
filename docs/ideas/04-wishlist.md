# 4. Wishlist with live progress

## Problem
Kunz's donate page shows a monthly gap of about 1,267 ILS and a wishlist (a new printer at 2,400 ILS, filament at 90, a month of coffee at 120). Giving means a bank transfer and an email, and nobody can see what's already covered. The "claim" buttons don't work.

## What it does
- A wishlist where each item has a price, a progress bar and the people who chipped in (handle, or "anonymous").
- **Claim** an item outright, or **chip in** any amount toward a big one (the printer fund).
- Payment through a link the donor opens on their phone. Key-holders confirm the money arrived, then the bar moves. No card data ever touches our server.
- A monthly "running costs" bar: rent, electricity, internet and arnona against dues plus donations, so the gap is visible and shrinks in public.
- Consumables flagged "running low" in the parts finder (plan 2) can be added to the list in one tap.

## Payment: decide with key-holders
- Simplest: a PayBox group or a Bit business payment link per item, with the item name in the note. Check what Kunz can open; Bit business needs a registered business.
- Later: an Israeli card processor (for example Grow/Meshulam, Cardcom or Tranzila; compare fees) with a webhook that confirms payment automatically. Not tax-deductible until Kunz is a non-profit (amuta); say so on the page, as kunz.im does.

## Data
- `wishes/<id>.json`: `{ id, title, titleHe, price, image?, priority, status: "open" | "funded" | "bought", createdBy, createdAt }`.
- `pledges/<wishId>/<id>.json`: `{ amount, handle?, anonymous, method, confirmed: boolean, confirmedBy?, at }`.
- `costs/<YYYY-MM>.json`: `{ rent, electricity, internet, arnona, dues, donations }`, key-holders only.

## API
- `GET /api/wishes`: items with confirmed totals (public).
- `POST /api/wishes/<id>/pledge` `{ amount, anonymous }`: anyone, including non-members (it's a donation), with a honeypot and rate limit; creates an unconfirmed pledge and returns the payment link.
- `POST /api/admin` actions: add/edit/remove wish, confirm/reject pledge, mark bought, enter monthly costs.

## UI
- A Wishlist screen: the monthly bar at the top, then items as cards with photo, price, progress and "Chip in" (lime, the one primary action) or "Claim it".
- Chip-in sheet: preset amounts (18, 54, 180 ILS, matching kunz.im), custom amount, anonymous toggle, then "Pay with PayBox/Bit", which opens the link.
- Thank-you state and a "pending confirmation" line until a key-holder confirms.
- A public share link per item for Telegram and Instagram.

## Abuse
- Unconfirmed pledges don't move the bar, so fake pledges change nothing visible. Key-holders see and reject them.
- Caps on pledge count per IP per day.

## Steps
1. Key-holders choose the payment link method.
2. Tests: totals (confirmed only), funded state, monthly gap maths.
3. API, admin actions, screens.
4. Copy kunz.im's current wishlist in as the first items (with key-holders checking prices).

## Effort
A weekend, plus the payment decision.
