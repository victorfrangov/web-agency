"use client"

// Responsive static PNG shader backgrounds loaded via <picture> element
import { CustomCursor } from "@/components/custom-cursor"
import { HeroSection } from "@/components/sections/hero-section"
import { WorkSection } from "@/components/sections/work-section"
import { ServicesSection } from "@/components/sections/services-section"
// import { AboutSection } from "@/components/sections/about-section"
import { ProcessSection } from "@/components/sections/process"
import { ContactSection } from "@/components/sections/contact-section"
import { Nav } from "@/components/sections/nav"

import { useRef, useEffect, useState, useCallback } from "react"

const SECTION_COUNT = 5
 
export default function HomeClient() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const [currentSection, setCurrentSection] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const scrollThrottleRef = useRef<number | undefined>(undefined)

  // detect touch devices / mobile to disable custom cursor
  useEffect(() => {
    const isTouch =
      typeof window !== "undefined" &&
      ("ontouchstart" in window ||
        (navigator as any).maxTouchPoints > 0 ||
        window.matchMedia?.("(hover: none)").matches)
    setIsTouchDevice(Boolean(isTouch))
  }, [])
 
  // keep nav and content visible immediately when using static backgrounds
  useEffect(() => setIsLoaded(true), [])

  // SCROLL TO SECTION — uses document-level scroll via window.scrollTo
  const scrollToSection = useCallback((index: number) => {
    const section = sectionRefs.current[index]
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
    setCurrentSection(index)
  }, [])

  // SCROLL — detect vertical section from document scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (scrollThrottleRef.current) return

      scrollThrottleRef.current = requestAnimationFrame(() => {
        const scrollTop = window.scrollY
        const viewportHeight = window.innerHeight

        // Find which section is most visible
        let bestSection = 0
        let bestVisibility = -1

        for (let i = 0; i < SECTION_COUNT; i++) {
          const el = sectionRefs.current[i]
          if (!el) continue

          const rect = el.getBoundingClientRect()
          // How much of this section is in the viewport
          const visibleTop = Math.max(0, rect.top)
          const visibleBottom = Math.min(viewportHeight, rect.bottom)
          const visibleHeight = Math.max(0, visibleBottom - visibleTop)

          if (visibleHeight > bestVisibility) {
            bestVisibility = visibleHeight
            bestSection = i
          }
        }

        setCurrentSection((prev) => (prev === bestSection ? prev : bestSection))
        scrollThrottleRef.current = undefined
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (scrollThrottleRef.current) cancelAnimationFrame(scrollThrottleRef.current)
    }
  }, [])

  // helper to assign section refs
  const setSectionRef = useCallback((index: number) => (el: HTMLElement | null) => {
    sectionRefs.current[index] = el
  }, [])

  return (
    <main className="relative w-full">
      {!isTouchDevice && <CustomCursor />}

      {/* shader background image — responsive per viewport */}
      <div className="fixed inset-0 z-0 bg-background">
        <picture>
          <source
            srcSet="/shader-bg/shader-ultrawide-3440x1440.png"
            media="(min-width: 2560px)"
          />
          <source
            srcSet="/shader-bg/shader-desktop-1920x1080.png"
            media="(min-width: 1024px)"
          />
          <source
            srcSet="/shader-bg/shader-tablet-1366x768.png"
            media="(min-width: 640px)"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/shader-bg/shader-mobile-828x1792.png"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        </picture>
      </div>

      <Nav currentSection={currentSection} onNavigate={scrollToSection} isLoaded={isLoaded} />

      <div
        className={`relative z-10 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <div ref={setSectionRef(0)}><HeroSection onPrimaryClick={() => scrollToSection(4)} onSecondaryClick={() => scrollToSection(1)} /></div>
        <div ref={setSectionRef(1)}><WorkSection /></div>
        <div ref={setSectionRef(2)}><ServicesSection /></div>
        <div ref={setSectionRef(3)}><ProcessSection /></div>
        {/* <div ref={setSectionRef(4)}><AboutSection scrollToSection={scrollToSection} /></div> */}
        <div ref={setSectionRef(4)}><ContactSection /></div>
      </div>
    </main>
  )
}
