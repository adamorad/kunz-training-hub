/** What could be built next. Plans live in docs/ideas/. Keep in sync with docs/ideas/README.md. */
const PLANS = "https://github.com/adamorad/kunz-training-hub/blob/main/docs/ideas/";

export const IDEAS = [
  { id: "open-now", plan: "01-open-now.md", effort: "S", en: "Open now", he: "פתוח עכשיו", sumEn: "See if the space is open, who opened it and the usual hours. Listed on hackerspace maps.", sumHe: "רואים אם המרחב פתוח, מי פתח ומה השעות הקבועות. מופיע במפות ההאקרספייסים." },
  { id: "parts-finder", plan: "02-parts-finder.md", effort: "M", en: "Parts and tools finder", he: "איתור חלקים וכלים", sumEn: "A QR code on every drawer, with a photo of what's inside and search.", sumHe: "QR על כל מגירה, עם תמונה של מה שבפנים וחיפוש." },
  { id: "tool-status", plan: "03-tool-status.md", effort: "S", en: "Tool status", he: "מצב הכלים", sumEn: "Working, needs attention or out of order, with a fault log for each tool.", sumHe: "עובד, צריך טיפול או מקולקל, עם יומן תקלות לכל כלי." },
  { id: "wishlist", plan: "04-wishlist.md", effort: "M", en: "Wishlist", he: "רשימת משאלות", sumEn: "Chip in for the new printer or filament, and watch the monthly gap close.", sumHe: "תורמים למדפסת החדשה או לפילמנט, ורואים את הפער החודשי נסגר." },
  { id: "workshops", plan: "05-workshop-tickets.md", effort: "L", en: "Workshop tickets", he: "כרטיסים לסדנאות", sumEn: "Public workshop pages with booking and payment, and the teacher's share worked out.", sumHe: "עמודי סדנאות פתוחים לציבור עם הרשמה ותשלום, וחישוב החלק של המנחה." },
  { id: "dues", plan: "06-dues.md", effort: "M", en: "Dues tracker", he: "מעקב דמי חבר", sumEn: "Key-holders see who paid this month; you see only your own status.", sumHe: "מחזיקי המפתח רואים מי שילם החודש; אתם רואים רק את שלכם." },
  { id: "project-wall", plan: "07-project-wall.md", effort: "M", en: "Project wall", he: "קיר הפרויקטים", sumEn: "Show what you built, with photos and the tools you used.", sumHe: "מראים מה בניתם, עם תמונות והכלים שהשתמשתם בהם." },
  { id: "rota", plan: "08-keyholder-rota.md", effort: "S", en: "Key-holder rota", he: "תורנות מפתחות", sumEn: "Who opens tonight, and swaps between key-holders in one tap.", sumHe: "מי פותח הערב, והחלפות בין מחזיקי מפתח בלחיצה." },
  { id: "door-sensor", plan: "09-door-sensor.md", effort: "M", en: "Door sensor build night", he: "ערב בניית חיישן דלת", sumEn: "An ESP32 on the lock tells the site when we're open. We build it together.", sumHe: "ESP32 על המנעול מעדכן את האתר כשאנחנו פתוחים. בונים אותו ביחד." },
  { id: "laser-rfid", plan: "10-laser-rfid.md", effort: "L", en: "Laser RFID lock", he: "נעילת RFID ללייזר", sumEn: "The laser only turns on for trained members' tags. Open-source parts, built at Kunz.", sumHe: "הלייזר נדלק רק לתגים של מי שעבר הדרכה. חלקים בקוד פתוח, נבנה בקונץ." },
].map((i) => ({ ...i, url: PLANS + i.plan }));

export type Idea = (typeof IDEAS)[number];
export const MAX_VOTES = 3;

/** A member's votes: known ideas only, no duplicates, at most MAX_VOTES. */
export function cleanVotes(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  const ids = new Set(IDEAS.map((i) => i.id));
  return [...new Set(v.filter((x): x is string => typeof x === "string" && ids.has(x)))].slice(0, MAX_VOTES);
}

/** Votes per idea, most voted first (ties keep the list order). */
export function tally(ballots: string[][]) {
  return IDEAS.map((idea, order) => ({ idea, order, votes: ballots.filter((b) => b.includes(idea.id)).length }))
    .sort((a, b) => b.votes - a.votes || a.order - b.order)
    .map(({ idea, votes }) => ({ idea, votes }));
}
