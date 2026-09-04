import type { Metadata } from "next"
import { Cormorant_Garamond } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import Navbar from "@/components/ui/Navbar"
import TopBar from "@/components/ui/TopBar"
import CartDrawer from "@/components/ui/CartDrawer"

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-serif",
})

export const metadata: Metadata = {
  title: "Kemet Pharma",
  description: "Kemet Pharma - Cosmetics",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={serif.variable}>
      <body className="font-serif">
        <CartProvider>
          <TopBar />
          <Navbar />
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  )
}