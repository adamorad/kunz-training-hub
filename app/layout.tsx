import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Prefs } from "./prefs";
import { Header } from "./ui";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: "Kunz Training Hub",
  description: "Which tools at Kunz need training, who can train them, and who wants to learn.",
};

export const viewport: Viewport = { themeColor: "#0c0e11", viewportFit: "cover" };

// Applied before first paint: stored theme (dark by default) and language.
const PREFS_SCRIPT = `try{var d=document.documentElement;if(localStorage.getItem("kunz-theme")==="light")d.dataset.theme="light";if(localStorage.getItem("kunz-lang")==="he"){d.lang="he";d.dir="rtl"}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" dir="ltr" data-theme="dark" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREFS_SCRIPT }} />
      </head>
      <body>
        <Prefs>
          <Header />
          {children}
        </Prefs>
      </body>
    </html>
  );
}
