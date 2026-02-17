"use client"

// Using static PNG backgrounds instead of the live shader
import { CustomCursor } from "@/components/custom-cursor"
import { HeroSection } from "@/components/sections/hero-section"
import { WorkSection } from "@/components/sections/work-section"
import { ServicesSection } from "@/components/sections/services-section"
// import { AboutSection } from "@/components/sections/about-section"
import { ProcessSection } from "@/components/sections/process"
import { ContactSection } from "@/components/sections/contact-section"
import { Nav } from "@/components/sections/nav"

import { useRef, useEffect, useState } from "react"
 
export default function HomeClient() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const scrollThrottleRef = useRef<number | undefined>(undefined)
  const snapRestoreTimerRef = useRef<number | undefined>(undefined)
  const scrollAnimRef = useRef<number | undefined>(undefined)
  const isAutoScrollingRef = useRef(false)
  const animControlsRef = useRef<any>(null)

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

  // SCROLL TO SECTION — vertical
  const scrollToSection = (index: number) => {
    if (scrollContainerRef.current) {
      const target = scrollContainerRef.current.children[index] as HTMLElement | undefined
      const top = target ? target.offsetTop : scrollContainerRef.current.offsetHeight * index
      scrollContainerRef.current.scrollTo({
        top,
        behavior: "smooth",
      })
      setCurrentSection(index)
    }
  }

  // SCROLL — detect vertical section
  useEffect(() => {
    const handleScroll = () => {
      if (isAutoScrollingRef.current) return
      if (scrollThrottleRef.current) return

      scrollThrottleRef.current = requestAnimationFrame(() => {
        const container = scrollContainerRef.current
        if (!container) {
          scrollThrottleRef.current = undefined
          return
        }

        const sectionHeight = container.offsetHeight
        const scrollTop = container.scrollTop
        const newSection = Math.round(scrollTop / sectionHeight)

        if (newSection >= 0 && newSection <= 4) {
          setCurrentSection((prev) => (prev === newSection ? prev : newSection))
        }

        scrollThrottleRef.current = undefined
      })
    }

    const container = scrollContainerRef.current
    if (container) container.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      if (container) container.removeEventListener("scroll", handleScroll)
      if (scrollThrottleRef.current) cancelAnimationFrame(scrollThrottleRef.current)
      if (scrollAnimRef.current) cancelAnimationFrame(scrollAnimRef.current)
      if (snapRestoreTimerRef.current) window.clearTimeout(snapRestoreTimerRef.current)
    }
  }, [])

  return (
    <main className="relative h-screen w-full overflow-hidden">
      {!isTouchDevice && <CustomCursor />}

      {/* solid background color */}
      <div className="fixed inset-0 z-0 bg-background" />

      <Nav currentSection={currentSection} onNavigate={scrollToSection} isLoaded={isLoaded} />

      <div
        ref={scrollContainerRef}
        data-scroll-container
        className={`relative z-10 flex h-screen flex-col overflow-y-auto overflow-x-hidden transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <HeroSection onPrimaryClick={() => scrollToSection(4)} onSecondaryClick={() => scrollToSection(1)} />
        <WorkSection />
        <ServicesSection />
        <ProcessSection />
        {/* <AboutSection scrollToSection={scrollToSection} /> */}
        <ContactSection />
      </div>
    </main>
  )
}
