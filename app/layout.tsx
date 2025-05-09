import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import "./arabic-support.css"
import { ThemeSwitcher } from "@/components/theme-switcher"

export const metadata: Metadata = {
  title: "WOLF - واجهة المستخدم",
  description: "تطبيق WOLF للذكاء الاصطناعي",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-tajawal">
        <div className="fixed top-4 right-4 z-50">
          <ThemeSwitcher />
        </div>
        {children}
      </body>
    </html>
  )
}
