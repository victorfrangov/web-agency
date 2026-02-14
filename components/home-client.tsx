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
  const [bgImage, setBgImage] = useState<string>("/shader-bg/shader-desktop-1920x1080.png")
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

  // choose background PNG based on viewport size / aspect ratio
  useEffect(() => {
    const pick = () => {
      if (typeof window === "undefined") return
      const w = window.innerWidth
      const h = window.innerHeight
      const ratio = w / h

      if (ratio >= 2.2 || w >= 3000) {
        setBgImage("/shader-bg/shader-ultrawide-3440x1440.png")
      } else if (w >= 1200) {
        setBgImage("/shader-bg/shader-desktop-1920x1080.png")
      } else if (w >= 768) {
        setBgImage("/shader-bg/shader-tablet-1366x768.png")
      } else {
        setBgImage("/shader-bg/shader-mobile-828x1792.png")
      }
    }

    pick()
    window.addEventListener("resize", pick)
    return () => window.removeEventListener("resize", pick)
  }, [])

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
      if (scrollThrottleRef.current) return

      scrollThrottleRef.current = requestAnimationFrame(() => {
        if (!scrollContainerRef.current) {
          scrollThrottleRef.current = undefined
          return
        }

        const sectionHeight = scrollContainerRef.current.offsetHeight
        const scrollTop = scrollContainerRef.current.scrollTop
        const newSection = Math.round(scrollTop / sectionHeight)

        if (newSection !== currentSection && newSection >= 0 && newSection <= 4) {
          setCurrentSection(newSection)
        }

        scrollThrottleRef.current = undefined
      })
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll)
      }
      if (scrollThrottleRef.current) {
        cancelAnimationFrame(scrollThrottleRef.current)
      }
    }
  }, [currentSection])

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden">
      {!isTouchDevice && <CustomCursor />}

      {/* <div className="fixed inset-0 z-0">
        <img
          src={bgImage}
          alt="Background"
          className="inset-0 h-full w-full object-cover"
          draggable={false}
        />
      </div> */}

      <Nav currentSection={currentSection} onNavigate={scrollToSection} isLoaded={isLoaded} />

      <div
        ref={scrollContainerRef}
        data-scroll-container
        className={`relative z-10 flex h-full flex-col overflow-y-auto overflow-x-hidden transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
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
