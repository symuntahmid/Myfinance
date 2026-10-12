import type { Metadata } from "next";

import {
  Geist,
  Geist_Mono,
  Source_Serif_4,
} from "next/font/google";

import "./globals.css";

import { ThemeProvider } from "@/app/context/ThemeContext";
import { LanguageProvider } from "@/app/context/LanguageContext";

/* ==========================================
   PREMIUM FONT SYSTEM
========================================== */

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const anthropicSerif = Source_Serif_4({
  variable: "--font-anthropic-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
        ${geistSans.variable}
        ${geistMono.variable}
        ${anthropicSerif.variable}
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