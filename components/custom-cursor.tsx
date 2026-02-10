"use client"

import { useEffect, useRef } from "react"

export function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX
      const y = e.clientY

      const target = e.target as HTMLElement | null
      let isPointer = false
      if (target) {
        const computed = window.getComputedStyle(target)
        isPointer =
          computed.cursor === "pointer" ||
          target.tagName === "BUTTON" ||
          target.tagName === "A"
      }

      // keep size constant; only switch colors for clickable targets
      if (outerRef.current && innerRef.current) {
        outerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
        innerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`

        const outerDot = outerRef.current.firstElementChild as HTMLElement | null
        const innerDot = innerRef.current.firstElementChild as HTMLElement | null

        if (outerDot) {
          outerDot.style.borderColor = isPointer ? "#FFD166" : "rgba(255,255,255,1)"
          outerDot.style.transition = "border-color 120ms linear"
        }
        if (innerDot) {
          innerDot.style.background = isPointer ? "#FFD166" : "rgba(255,255,255,1)"
          innerDot.style.transition = "background-color 120ms linear"
        }
      }
    }

    const hideOnTouch = () => {
      if (outerRef.current) outerRef.current.style.display = "none"
      if (innerRef.current) innerRef.current.style.display = "none"
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("touchstart", hideOnTouch, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchstart", hideOnTouch)
    }
  }, [])

  return (
    <>
      <div
        ref={outerRef}
        className="pointer-events-none fixed left-0 top-0 mix-blend-difference will-change-transform"
        style={{ contain: "layout style paint", transform: "translate3d(-9999px, -9999px, 0)", zIndex: 99999 }}
      >
        <div className="h-4 w-4 rounded-full border-2" style={{ borderColor: "rgba(255,255,255,1)" }} />
      </div>
      <div
        ref={innerRef}
        className="pointer-events-none fixed left-0 top-0 mix-blend-difference will-change-transform"
        style={{ contain: "layout style paint", transform: "translate3d(-9999px, -9999px, 0)", zIndex: 99999 }}
      >
        <div className="h-2 w-2 rounded-full" style={{ background: "rgba(255,255,255,1)" }} />
      </div>
    </>
  )
}
