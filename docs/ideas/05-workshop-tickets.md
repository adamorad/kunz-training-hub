# 5. Workshop tickets

## Problem
Workshops are Kunz's second income (about 20% of rent per kunz.im), run by members for 0 to 150 ILS, 6 to 12 seats, with the teacher keeping 60%. Today they're announced in Telegram and paid by hand, the workshops page shows nothing, and the public can't easily find or book one.

## How it differs from training sessions
- Training sessions: members only, free, about using a Kunz tool safely.
- Workshops: open to the public, often paid, about a skill or project (soldering a synth kit, intro to Arduino). They need a public page, payment, and a payout to the teacher.

## What it does
- A public **Workshops** page with upcoming workshops: title, photo, date, length, price, seats left, teacher, what to bring, Hebrew or English.
- Booking with name, phone or email (for reminders and cancellations) and payment.
- Members propose a workshop through a form ("teach a kunz" on kunz.im); key-holders approve and publish it.
- After the workshop: attendance check-in (QR at the door), the teacher's 60% calculated, key-holders mark it paid out.
- Reminder the day before (email first; SMS or WhatsApp later if needed).

## Payments: needs a real provider
- A card processor with an Israeli merchant account and a webhook, so a seat is only confirmed after payment. Candidates to compare: Grow/Meshulam, Cardcom, Tranzila, PayPlus (fees, payment pages, Bit support, webhooks).
- Refund policy written with key-holders (for example full refund up to 48 h before).
- Free workshops skip payment and just reserve a seat.

## Data
- `workshops/<id>.json`: `{ id, title, titleHe, description, teacher: responseId, when, durationMin, seats, price, language, bring, photo?, status: "proposed" | "published" | "done" | "cancelled" }`.
- `bookings/<workshopId>/<id>.json`: `{ name, contact, paid: boolean, paymentRef?, checkedIn: boolean, at }`. Contact details are private: teacher and key-holders only.
- `payouts/<workshopId>.json`: `{ revenue, teacherShare, paidOutAt?, by }`.

## API
- `GET /api/workshops` (public, published only).
- `POST /api/workshops` (member proposes), `POST /api/admin` publish, cancel, payout.
- `POST /api/workshops/<id>/book`: public, rate-limited, creates a pending booking and returns the provider's payment URL.
- `POST /api/payments/webhook`: verifies the provider's signature, marks the booking paid.
- `POST /api/workshops/<id>/checkin`: the teacher scans or ticks attendees.

## UI
- Public Workshops page that works without the space code (it's for outsiders), linked from kunz.im and Instagram.
- Booking sheet; confirmation page with a calendar file (.ics).
- Teacher view: bookings, check-in list, expected payout.
- Key-holder view in `/admin`: proposals, revenue per month, payouts due.

## Privacy and abuse
- Public bookings store personal data: show a short privacy note, keep it only as long as needed (for example delete contacts 30 days after the workshop), never show it publicly.
- Seats are held for 15 minutes while payment is pending, then released.

## Steps
1. Key-holders choose the payment provider and refund policy.
2. Tests: seat holds, payment webhook idempotency, 60/40 split, refund window.
3. Public page, booking and webhook.
4. Proposal flow, teacher view, admin revenue.
5. First workshop as a pilot (Adam could teach "ship a web app with Claude Code").

## Effort
Several sessions. The biggest module, because money and personal data are involved.
