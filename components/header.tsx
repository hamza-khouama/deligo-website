"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Menu, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()

    // If we're not on the home page, navigate to home with hash
    if (pathname !== "/") {
      window.location.href = `/#${targetId}`
      return
    }

    // If we're on home page, scroll to section
    const element = document.getElementById(targetId)
    if (element) {
      const headerOffset = 72
      const elementPosition = element.offsetTop
      const offsetPosition = elementPosition - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100 transition-shadow ${isScrolled ? "shadow-lg" : ""}`}
    >
      <div className="container mx-auto px-4 h-[72px] flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <img src="/deligo-logo.png" alt="Déligo logo" className="w-12 h-12" />
          <span className="font-pacifico text-2xl text-gray-900">Déligo</span>
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, "home")}
            className="text-gray-700 hover:text-primary transition-colors px-4 py-2"
          >
            Home
          </a>
          <a
            href="#how-deligo-works"
            onClick={(e) => handleNavClick(e, "how-deligo-works")}
            className="text-gray-700 hover:text-primary transition-colors px-4 py-2"
          >
            How It Works
          </a>
          <a
            href="#key-features"
            onClick={(e) => handleNavClick(e, "key-features")}
            className="text-gray-700 hover:text-primary transition-colors px-4 py-2"
          >
            Features
          </a>
          <a
            href="#become-moving-agent"
            onClick={(e) => handleNavClick(e, "become-moving-agent")}
            className="text-gray-700 hover:text-primary transition-colors px-4 py-2"
          >
            Become an Agent
          </a>
          <a
            href="#contact-support"
            onClick={(e) => handleNavClick(e, "contact-support")}
            className="text-gray-700 hover:text-primary transition-colors px-4 py-2"
          >
            Contact
          </a>
        </nav>

        <Button className="hidden lg:flex items-center gap-2 bg-primary text-white hover:bg-primary/90">
          <Download className="w-4 h-4" />
          <span className="whitespace-nowrap">Download App</span>
        </Button>

        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}
