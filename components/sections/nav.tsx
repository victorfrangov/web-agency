"use client"

import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"

interface NavProps {
  currentSection: number
  onNavigate: (index: number) => void
}

export function Nav({ currentSection, onNavigate }: NavProps) {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations("nav")

  const toggleLang = () => {
    const target = locale === "en" ? "fr" : "en"
    router.push(`/${target}`)
  }

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-6 transition-opacity duration-700 md:px-12`}
    >
      <button
        onClick={() => onNavigate(0)}
        className="flex items-center gap-2 transition-transform hover:scale-105"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/15 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-foreground/25">
          <span className="font-sans text-xl font-bold text-foreground">S</span>
        </div>
        <span className="font-sans text-xl font-semibold tracking-tight text-foreground">Sigma Industries</span>
      </button>

      <div className="hidden items-center gap-8 md:flex">
        {[t("home"), t("work"), t("services"), t("about"), t("contact")].map((label, index) => (
          <button
            key={label}
            onClick={() => onNavigate(index)}
            className={`group relative font-sans text-sm font-medium transition-colors ${
              currentSection === index ? "text-foreground" : "text-foreground/80 hover:text-foreground"
            }`}
          >
            {label}
            <span
              className={`absolute -bottom-1 left-0 h-px bg-foreground transition-all duration-300 ${
                currentSection === index ? "w-full" : "w-0 group-hover:w-full"
              }`}
            />
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate(4)}
          className="hidden rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background md:inline-flex"
        >
          {t("getStarted")}
        </button>
        <button
          onClick={toggleLang}
          aria-label="Toggle language"
          className="rounded-md border border-foreground/10 bg-foreground/10 px-3 py-1 text-sm font-medium"
        >
          {t("lang")}
        </button>
      </div>
    </nav>
  )
}
