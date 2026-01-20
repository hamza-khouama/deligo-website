import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Pacifico } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
})

export const metadata: Metadata = {
  title: "Déligo",
  description: "",
  generator: "",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/deligo-logo.png" type="image/x-icon" />
      </head>
      <body className={`${inter.className} ${pacifico.variable}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
