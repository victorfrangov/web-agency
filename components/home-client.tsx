"use client"

import { Shader, ChromaFlow, Swirl } from "shaders/react"
import { CustomCursor } from "@/components/custom-cursor"
import { GrainOverlay } from "@/components/grain-overlay"
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
  const shaderContainerRef = useRef<HTMLDivElement>(null)
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
 
  // ensure correct viewport height on mobile (iOS Safari) using --vh
  useEffect(() => {
    const setVh = () => {
      const vh = window.visualViewport?.height ?? window.innerHeight
      document.documentElement.style.setProperty("--vh", `${vh * 0.01}px`)
    }

    setVh()
    window.addEventListener("resize", setVh)
    window.addEventListener("orientationchange", setVh)
    window.visualViewport?.addEventListener("resize", setVh)

    return () => {
      window.removeEventListener("resize", setVh)
      window.removeEventListener("orientationchange", setVh)
      window.visualViewport?.removeEventListener("resize", setVh)
    }
  }, [])

  useEffect(() => {
    const checkShaderReady = () => {
      if (shaderContainerRef.current) {
        const canvas = shaderContainerRef.current.querySelector("canvas")
        if (canvas && canvas.width > 0 && canvas.height > 0) {
          setIsLoaded(true)
          return true
        }
      }
      return false
    }

    if (checkShaderReady()) return

    const intervalId = setInterval(() => {
      if (checkShaderReady()) {
        clearInterval(intervalId)
      }
    }, 100)

    const fallbackTimer = setTimeout(() => {
      setIsLoaded(true)
    }, 1500)

    return () => {
      clearInterval(intervalId)
      clearTimeout(fallbackTimer)
    }
  }, [])

  // SCROLL TO SECTION — vertical
  const scrollToSection = (index: number) => {
    if (scrollContainerRef.current) {
      // scroll to the actual section element instead of forcing a section-height snap
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
    <main
      className="relative h-screen w-full overflow-hidden bg-background"
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
    >
      {!isTouchDevice && <CustomCursor />}
      <GrainOverlay />

      <div
        ref={shaderContainerRef}
        className={`fixed inset-0 z-0 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{ contain: "strict" }}
      >
        <Shader className="h-full w-full">
          <Swirl
            colorA="#0D1B2A"
            colorB="#415A77"
            speed={0.8}
            detail={0.8}
            blend={50}
            coarseX={40}
            coarseY={40}
            mediumX={40}
            mediumY={40}
            fineX={40}
            fineY={40}
          />
          <ChromaFlow
            baseColor="#1B263B"
            upColor="#415A77"
            downColor="#E0E1DD"
            leftColor="#778DA9"
            rightColor="#0D1B2A"
            intensity={0.9}
            radius={1.8}
            momentum={25}
            maskType="alpha"
            opacity={0.97}
          />
        </Shader>
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className={`${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <Nav currentSection={currentSection} onNavigate={scrollToSection} />
      </div>

      <div
        ref={scrollContainerRef}
        data-scroll-container
        className={`relative z-10 flex flex-col h-screen overflow-y-auto overflow-x-hidden transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", height: "calc(var(--vh, 1vh) * 100)" }}
      >
        <HeroSection onPrimaryClick={() => scrollToSection(4)} onSecondaryClick={() => scrollToSection(1)} />
        <WorkSection />
        <ServicesSection />
        <ProcessSection />
        {/* <AboutSection scrollToSection={scrollToSection} /> */}
        <ContactSection />
      </div>

      <style jsx global>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  )
}
