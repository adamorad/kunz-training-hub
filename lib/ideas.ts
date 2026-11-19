/** What could be built next. Plans live in docs/ideas/. Keep in sync with docs/ideas/README.md. */
const PLANS = "https://github.com/adamorad/kunz-training-hub/blob/main/docs/ideas/";

export const IDEAS = [
  { id: "open-now", cat: "space", plan: "01-open-now.md", effort: "S", en: "Open now", he: "פתוח עכשיו", sumEn: "See if the space is open, who opened it and the usual hours. Listed on hackerspace maps.", sumHe: "רואים אם המרחב פתוח, מי פתח ומה השעות הקבועות. מופיע במפות ההאקרספייסים." },
  { id: "parts-finder", cat: "space", plan: "02-parts-finder.md", effort: "M", en: "Parts and tools finder", he: "איתור חלקים וכלים", sumEn: "A QR code on every drawer, with a photo of what's inside and search.", sumHe: "QR על כל מגירה, עם תמונה של מה שבפנים וחיפוש." },
  { id: "tool-status", cat: "space", plan: "03-tool-status.md", effort: "S", en: "Tool status", he: "מצב הכלים", sumEn: "Working, needs attention or out of order, with a fault log for each tool.", sumHe: "עובד, צריך טיפול או מקולקל, עם יומן תקלות לכל כלי." },
  { id: "wishlist", cat: "money", plan: "04-wishlist.md", effort: "M", en: "Wishlist", he: "רשימת משאלות", sumEn: "Chip in for the new printer or filament, and watch the monthly gap close.", sumHe: "תורמים למדפסת החדשה או לפילמנט, ורואים את הפער החודשי נסגר." },
  { id: "workshops", cat: "money", plan: "05-workshop-tickets.md", effort: "L", en: "Workshop tickets", he: "כרטיסים לסדנאות", sumEn: "Public workshop pages with booking and payment, and the teacher's share worked out.", sumHe: "עמודי סדנאות פתוחים לציבור עם הרשמה ותשלום, וחישוב החלק של המנחה." },
  { id: "dues", cat: "money", plan: "06-dues.md", effort: "M", en: "Dues tracker", he: "מעקב דמי חבר", sumEn: "Key-holders see who paid this month; you see only your own status.", sumHe: "מחזיקי המפתח רואים מי שילם החודש; אתם רואים רק את שלכם." },
  { id: "project-wall", cat: "community", plan: "07-project-wall.md", effort: "M", en: "Project wall", he: "קיר הפרויקטים", sumEn: "Show what you built, with photos and the tools you used.", sumHe: "מראים מה בניתם, עם תמונות והכלים שהשתמשתם בהם." },
  { id: "rota", cat: "space", plan: "08-keyholder-rota.md", effort: "S", en: "Key-holder rota", he: "תורנות מפתחות", sumEn: "Who opens tonight, and swaps between key-holders in one tap.", sumHe: "מי פותח הערב, והחלפות בין מחזיקי מפתח בלחיצה." },
  { id: "door-sensor", cat: "hardware", plan: "09-door-sensor.md", effort: "M", en: "Door sensor build night", he: "ערב בניית חיישן דלת", sumEn: "An ESP32 on the lock tells the site when we're open. We build it together.", sumHe: "ESP32 על המנעול מעדכן את האתר כשאנחנו פתוחים. בונים אותו ביחד." },
  { id: "laser-rfid", cat: "hardware", plan: "10-laser-rfid.md", effort: "L", en: "Laser RFID lock", he: "נעילת RFID ללייזר", sumEn: "The laser only turns on for trained members' tags. Open-source parts, built at Kunz.", sumHe: "הלייזר נדלק רק לתגים של מי שעבר הדרכה. חלקים בקוד פתוח, נבנה בקונץ." },
  { id: "events", cat: "community", plan: "11-events-calendar.md", effort: "M", en: "Events calendar", he: "לוח אירועים", sumEn: "Open nights, workshops, hack days and film nights in one calendar you can subscribe to.", sumHe: "ערבים פתוחים, סדנאות, האקדיי וערבי סרט בלוח אחד שאפשר להירשם אליו." },
  { id: "talks", cat: "learning", plan: "12-lightning-talks.md", effort: "S", en: "Lightning talks", he: "הרצאות בזק", sumEn: "Sign up for a 10-minute talk at the monthly talks night, with slides and a running order.", sumHe: "נרשמים להרצאה של 10 דקות בערב ההרצאות החודשי, עם שקפים וסדר הופעה." },
  { id: "print-queue", cat: "space", plan: "13-3d-print-queue.md", effort: "M", en: "3D print queue", he: "תור הדפסות תלת-ממד", sumEn: "Queue a print, see what's printing now, get a message when yours is done.", sumHe: "מכניסים הדפסה לתור, רואים מה מודפס עכשיו, ומקבלים הודעה כשזה מוכן." },
  { id: "booking", cat: "space", plan: "14-tool-time-booking.md", effort: "M", en: "Tool time booking", he: "הזמנת זמן על כלים", sumEn: "Book an hour on the laser or a printer so you don't arrive to find it taken.", sumHe: "מזמינים שעה על הלייזר או מדפסת, כדי לא להגיע ולגלות שהוא תפוס." },
  { id: "power", cat: "hardware", plan: "15-power-dashboard.md", effort: "M", en: "Power dashboard", he: "לוח צריכת חשמל", sumEn: "A clamp meter on the panel shows live electricity use, so 'sponsor a watt' means something.", sumHe: "מד על הלוח החשמלי מראה צריכה בזמן אמת, כך ש'תרמו וואט' מקבל משמעות." },
  { id: "air", cat: "hardware", plan: "16-air-quality-monitor.md", effort: "M", en: "Air quality monitor", he: "ניטור איכות אוויר", sumEn: "Sensors in the fab corner warn when resin or laser fumes build up.", sumHe: "חיישנים בפינת הייצור מתריעים כשיש הצטברות אדים משרף או מהלייזר." },
  { id: "library", cat: "community", plan: "17-lending-library.md", effort: "S", en: "Lending library", he: "ספריית השאלה", sumEn: "Borrow books and hand tools to take home, with return dates and reminders.", sumHe: "שואלים ספרים וכלי עבודה הביתה, עם תאריך החזרה ותזכורות." },
  { id: "skills", cat: "learning", plan: "18-skill-swap.md", effort: "S", en: "Skill swap", he: "החלפת כישורים", sumEn: "Beyond tools: who knows Python, PCB design, sewing or welding, and is happy to help.", sumHe: "מעבר לכלים: מי יודע פייתון, תכנון PCB, תפירה או ריתוך, ושמח לעזור." },
  { id: "onboarding", cat: "community", plan: "19-new-member-onboarding.md", effort: "M", en: "New member onboarding", he: "קליטת חברים חדשים", sumEn: "A first-week checklist and a buddy, so new members don't feel lost.", sumHe: "רשימה לשבוע הראשון וחבר מלווה, כדי שחברים חדשים לא ירגישו אבודים." },
  { id: "guestbook", cat: "space", plan: "20-digital-guestbook.md", effort: "S", en: "Digital guestbook", he: "ספר אורחים דיגיטלי", sumEn: "Visitors sign in on a tablet by the door instead of the paper logbook.", sumHe: "אורחים נרשמים בטאבלט ליד הדלת במקום ביומן הנייר." },
  { id: "whos-here", cat: "community", plan: "21-who-s-here-now.md", effort: "S", en: "Who's here now", he: "מי פה עכשיו", sumEn: "Opt in to show you're at the space, so friends know when to come.", sumHe: "בוחרים להראות שאתם במרחב, כדי שחברים ידעו מתי לבוא." },
  { id: "collab", cat: "community", plan: "22-find-collaborators.md", effort: "S", en: "Find collaborators", he: "מחפשים שותפים", sumEn: "Post a project idea that needs help, and team up with members who want in.", sumHe: "מפרסמים רעיון לפרויקט שצריך עזרה, ומצטרפים לחברים שרוצים להשתתף." },
  { id: "honesty-shop", cat: "money", plan: "23-honesty-shop.md", effort: "S", en: "Honesty shop", he: "חנות אמון", sumEn: "Take a resistor kit, filament or a snack, pay what's listed on your phone.", sumHe: "לוקחים ערכת נגדים, פילמנט או חטיף, ומשלמים את המחיר מהטלפון." },
  { id: "materials", cat: "money", plan: "24-material-usage-log.md", effort: "S", en: "Material usage log", he: "יומן שימוש בחומרים", sumEn: "Log grams of filament and resin used per print, to plan restocking and share costs.", sumHe: "רושמים כמה גרם פילמנט ושרף נוצלו בכל הדפסה, לתכנון הזמנות וחלוקת עלויות." },
  { id: "challenges", cat: "community", plan: "25-monthly-build-challenge.md", effort: "S", en: "Monthly build challenge", he: "אתגר בנייה חודשי", sumEn: "A theme each month, a deadline, a show-and-tell, and members vote for favourites.", sumHe: "נושא בכל חודש, דדליין, ערב הצגה, וחברים מצביעים על המועדפים." },
  { id: "wiki", cat: "learning", plan: "26-space-wiki.md", effort: "M", en: "Space wiki", he: "ויקי של המרחב", sumEn: "How-tos beyond the tools: Wi-Fi, closing up, the coffee machine, who to call.", sumHe: "מדריכים מעבר לכלים: וויפיי, סגירת המרחב, מכונת הקפה, למי להתקשר." },
  { id: "closing", cat: "space", plan: "27-closing-checklist.md", effort: "S", en: "Closing checklist", he: "רשימת סגירה", sumEn: "The last person out ticks: laser off, windows shut, lights off, door locked.", sumHe: "האחרון שיוצא מסמן: לייזר כבוי, חלונות סגורים, אורות כבויים, דלת נעולה." },
  { id: "sponsors", cat: "money", plan: "28-sponsors-and-partners.md", effort: "S", en: "Sponsors and partners", he: "נותני חסות ושותפים", sumEn: "A page thanking businesses that donate parts, space or money, and how to become one.", sumHe: "עמוד תודה לעסקים שתורמים חלקים, מקום או כסף, ואיך להצטרף." },
  { id: "open-house", cat: "community", plan: "29-open-house-sign-up.md", effort: "S", en: "Open house sign-up", he: "הרשמה לבית פתוח", sumEn: "Public open days with limited spots, so newcomers can visit without overcrowding.", sumHe: "ימים פתוחים לציבור עם מקומות מוגבלים, כדי שאנשים חדשים יבואו בלי עומס." },
  { id: "eink-door", cat: "hardware", plan: "30-e-ink-door-sign.md", effort: "M", en: "E-ink door sign", he: "שלט דיו אלקטרוני בדלת", sumEn: "A low-power e-paper screen by the entrance shows open status and the next event.", sumHe: "מסך נייר אלקטרוני חסכוני ליד הכניסה מציג אם פתוח ומה האירוע הבא." },
].map((i) => ({ ...i, url: PLANS + i.plan }));

export type Idea = (typeof IDEAS)[number];
export const CATS = ["space", "money", "community", "learning", "hardware"] as const;
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
