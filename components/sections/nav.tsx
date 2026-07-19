"use client"

import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { MagneticButton } from "@/components/magnetic-button"

interface NavProps {
  currentSection: number
  onNavigate: (index: number) => void
  isLoaded?: boolean
}

export function Nav({ currentSection, onNavigate, isLoaded }: NavProps) {
  const locale = useLocale()
  const t = useTranslations("nav")
  const targetLocale = locale === "en" ? "fr" : "en"

  const navItems = [
    { label: t("home"), href: "#hero" },
    { label: t("work"), href: "#work" },
    { label: t("services"), href: "#services" },
    { label: t("about"), href: "#process" },
    { label: t("contact"), href: "#contact" },
  ]

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 pb-6 pt-[calc(1.5rem+env(safe-area-inset-top))] transition-all duration-700 md:px-12 ${
        isLoaded ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-3 pointer-events-none"
      }`}
    >
      <div className="flex md:flex-1 justify-start">
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault()
            onNavigate(0)
          }}
          className="flex h-10 items-center transition-transform hover:scale-105"
          aria-label="Home"
        >
          <span className="font-sans text-xl font-bold text-foreground">sd</span>
        </a>
      </div>

      <div className="hidden items-center justify-center gap-8 md:flex">
        {navItems.map((item, index) => (
          <a
            key={item.label}
            href={item.href}
            onClick={(e) => {
              e.preventDefault()
              onNavigate(index)
            }}
            className={`group relative font-sans text-sm font-medium transition-colors ${
              currentSection === index ? "text-foreground" : "text-foreground/80 hover:text-foreground"
            }`}
          >
            {item.label}
            <span
              className={`absolute -bottom-1 left-0 h-px bg-foreground transition-all duration-300 ${
                currentSection === index ? "w-full" : "w-0 group-hover:w-full"
              }`}
            />
          </a>
        ))}
      </div>

      <div className="flex items-center justify-end gap-4 md:flex-1">
        <MagneticButton
          onClick={() => onNavigate(4)}
          className="hidden rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background md:inline-flex"
        >
          {t("getStarted")}
        </MagneticButton>

        <Link
          href={`/${targetLocale}`}
          aria-label="Toggle language"
          className="rounded-md border border-foreground/10 bg-foreground/10 px-3 py-1 text-sm font-medium"
        >
          {t("lang")}
        </Link>
      </div>
    </nav>
  )
}

