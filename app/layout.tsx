export const dynamic = "force-static"

import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`app ${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}