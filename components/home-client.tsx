"use client"

import { Shader, ChromaFlow, Swirl } from "shaders/react"
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

  // SCROLL TO SECTION — supports body scroll on touch, inner container on desktop
  const scrollToSection = (index: number) => {
    const sections = Array.from(document.querySelectorAll("[data-section]")) as HTMLElement[]
    const target = sections[index]
    const top = target ? (target.getBoundingClientRect().top + window.scrollY) : window.innerHeight * index

    if (isTouchDevice) {
      window.scrollTo({ top, behavior: "smooth" })
    } else if (scrollContainerRef.current) {
      // desktop: scroll the inner container to preserve desktop scrollbar behavior
      const child = scrollContainerRef.current.children[index] as HTMLElement | undefined
      const topLocal = child ? child.offsetTop : scrollContainerRef.current.offsetHeight * index
      scrollContainerRef.current.scrollTo({ top: topLocal, behavior: "smooth" })
    }
    setCurrentSection(index)
  }

  // SCROLL — detect vertical section (body scroll on touch, inner on desktop)
  useEffect(() => {
    const handleScroll = () => {
      if (scrollThrottleRef.current) return

      scrollThrottleRef.current = requestAnimationFrame(() => {
        if (isTouchDevice) {
          const sectionHeight = window.innerHeight
          const scrollTop = window.scrollY
          const newSection = Math.round(scrollTop / sectionHeight)
          if (newSection !== currentSection) setCurrentSection(newSection)
        } else {
          if (!scrollContainerRef.current) {
            scrollThrottleRef.current = undefined
            return
          }
          const sectionHeight = scrollContainerRef.current.offsetHeight
          const scrollTop = scrollContainerRef.current.scrollTop
          const newSection = Math.round(scrollTop / sectionHeight)
          if (newSection !== currentSection) setCurrentSection(newSection)
        }
        scrollThrottleRef.current = undefined
      })
    }

    const container = isTouchDevice ? window : scrollContainerRef.current
    container?.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      container?.removeEventListener("scroll", handleScroll)
      if (scrollThrottleRef.current) cancelAnimationFrame(scrollThrottleRef.current)
    }
  }, [currentSection, isTouchDevice])

  return (
    <main className="relative w-full bg-[#0D1B2A]">
      {!isTouchDevice && <CustomCursor />}

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

      <Nav currentSection={currentSection} onNavigate={scrollToSection} isLoaded={isLoaded} />

      <div
        ref={scrollContainerRef}
        data-scroll-container
        className={`relative z-10 flex flex-col transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        // keep overflow for desktop; on touch devices body will scroll, so we don't force overflow here
        style={{ overflowY: isTouchDevice ? "visible" : "auto" }}
      >
        <div data-section><HeroSection onPrimaryClick={() => scrollToSection(4)} onSecondaryClick={() => scrollToSection(1)} /></div>
        <div data-section><WorkSection /></div>
        <div data-section><ServicesSection /></div>
        <div data-section><ProcessSection /></div>
        {/* <div data-section><AboutSection scrollToSection={scrollToSection} /></div> */}
        <div data-section><ContactSection /></div>
      </div>
    </main>
  )
}
