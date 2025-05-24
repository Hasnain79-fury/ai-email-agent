"use client"

import { usePathname } from "next/navigation"
import Script from "next/script"

interface SeoHeadProps {
  baseUrl: string
}

export default function SeoHead({ baseUrl }: SeoHeadProps) {
  const pathname = usePathname()
  const currentUrl = `${baseUrl}${pathname}`

  return (
    <>
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* Google Analytics Example (replace with your measurement ID) */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX');
        `}
      </Script>
    </>
  )
}
