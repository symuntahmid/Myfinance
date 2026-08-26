import type { Metadata } from "next";

import {
  Geist,
  Geist_Mono,
  Cormorant_Garamond,
} from "next/font/google";

import "./globals.css";

import {
  ThemeProvider,
} from "@/app/context/ThemeContext";



/* ==========================================
   PREMIUM FONT SYSTEM

   Geist:
   - UI
   - Numbers
   - Dashboard data
   - Buttons

   Cormorant:
   - Premium headings
   - Emotional messaging
   - AI/CFO branding
========================================== */


const geistSans = Geist({

  variable:
    "--font-geist-sans",

  subsets:
    ["latin"],

  display:
    "swap",

});



const geistMono = Geist_Mono({

  variable:
    "--font-geist-mono",

  subsets:
    ["latin"],

  display:
    "swap",

});



const cormorant = Cormorant_Garamond({

  variable:
    "--font-serif",

  subsets:
    ["latin"],

  weight:
    [
      "400",
      "500",
      "600",
      "700",
    ],

  display:
    "swap",

});





export const metadata: Metadata = {

  title:
    "MyFinance | Your Personal CFO",

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

        ${cormorant.variable}

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

          {children}

        </ThemeProvider>


      </body>


    </html>

  );

}