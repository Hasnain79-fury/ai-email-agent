import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Email Generator | Create Professional Emails Instantly",
  description:
    "Generate professional, customized emails in seconds with our AI email generator. Choose tone, purpose, and language for perfectly crafted emails every time.",
  keywords: "email generator, AI email writer, professional emails, email templates, business communication",
  openGraph: {
    title: "AI Email Generator | Create Professional Emails Instantly",
    description: "Generate professional, customized emails in seconds with our AI email generator.",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: "AI Email Generator",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "AI Email Generator Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>{/* SEO enhancements can be added here if needed */}</head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
