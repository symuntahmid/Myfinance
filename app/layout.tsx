import type { Metadata } from "next";

import {
  Hind_Siliguri,
  Tiro_Bangla,
} from "next/font/google";

import "./globals.css";

import { ThemeProvider } from "@/app/context/ThemeContext";
import { LanguageProvider } from "@/app/context/LanguageContext";

/* ==========================================
   FONTS

   Hind Siliguri: clean text for Bangla and English.
   Tiro Bangla:   a Bangla book serif for greetings
                  and big numbers.
========================================== */

const hind = Hind_Siliguri({
  variable: "--font-hind",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const tiro = Tiro_Bangla({
  variable: "--font-tiro",
  subsets: ["bengali", "latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MyFinance | Your Personal CFO",

  description:
    "AI powered personal finance behaviour changing application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`
        ${hind.variable}
        ${tiro.variable}
        h-full
        antialiased
      `}
    >
      <body
        className="
          min-h-screen
          bg-[var(--background)]
          text-[var(--foreground)]
          font-sans
          tracking-[-0.01em]
        "
      >
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}