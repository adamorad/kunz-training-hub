"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePrefs } from "./prefs";
import { IconIdeas, IconSessions, IconTools, IconTrainers, IconYou } from "./ui";

const TABS = [
  { href: "/", key: "tabMe", icon: <IconYou />, match: (p: string) => p === "/" },
  { href: "/sessions", key: "tabSessions", icon: <IconSessions />, match: (p: string) => p.startsWith("/sessions") },
  { href: "/trainers", key: "tabTrainers", icon: <IconTrainers />, match: (p: string) => p.startsWith("/trainers") },
  { href: "/tools", key: "tabTools", icon: <IconTools />, match: (p: string) => p.startsWith("/tools") },
  { href: "/ideas", key: "tabIdeas", icon: <IconIdeas />, match: (p: string) => p.startsWith("/ideas") },
] as const;

/** The bottom tab bar, on every page. */
export function Tabs() {
  const { t } = usePrefs();
  const path = usePathname();
  const i = TABS.findIndex((x) => x.match(path));
  return (
    <nav className="tabs" aria-label="Sections">
      <div className="tabs-inner">
        {i >= 0 && <span className="tab-pip" style={{ insetInlineStart: `${i * 20}%` }} />}
        {TABS.map((x, k) => (
          <Link key={x.href} href={x.href} className="tab" aria-current={k === i ? "page" : undefined}>
            {x.icon}
            {t[x.key]}
          </Link>
        ))}
      </div>
    </nav>
  );
}

/** Footer links, on every page. */
export function Footer() {
  const { t, creds } = usePrefs();
  return (
    <footer>
      {t.footer} <a href="https://github.com/adamorad/kunz-training-hub">{t.source}</a>
      {" · "}
      <Link href="/admin">{t.keyholders}</Link>
      {creds && (
        <>
          {" · "}
          <a href="/api/responses?export=1">{t.download}</a>
        </>
      )}
    </footer>
  );
}
