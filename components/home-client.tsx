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
  const capturerRef = useRef<any>(null)
  const captureLoopRef = useRef<number | null>(null)
  const originalDateNowRef = useRef<(() => number) | null>(null)
  const fakeFrameIndexRef = useRef<number>(0)
  const captureFrameCountRef = useRef<number>(0)
  const captureAbortRef = useRef<boolean>(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaChunksRef = useRef<BlobPart[]>([])
  const targetFrameCountRef = useRef<number | null>(null)
  const mediaStopTimeoutRef = useRef<number | null>(null)
  const [captureFormat, setCaptureFormat] = useState<string>("webm")
  const [captureFPS, setCaptureFPS] = useState<number>(60)
  const [captureDuration, setCaptureDuration] = useState<number>(3)
  const [isCapturing, setIsCapturing] = useState(false)
  const [captureProgress, setCaptureProgress] = useState<number>(0)
  const jsZipLoadedRef = useRef<boolean>(false)
  const [videoError, setVideoError] = useState<string | null>(null)
  const [videoStatus, setVideoStatus] = useState<string>('idle')
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

  // Load CCapture script once (for browser only)
  useEffect(() => {
    if (typeof window === "undefined") return
    if ((window as any).CCapture) return

    const src = "https://unpkg.com/ccapture.js@1.1.0/build/CCapture.all.min.js"
    const script = document.createElement("script")
    script.src = src
    script.async = true
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  // Load JSZip for PNG zipping
  useEffect(() => {
    if (typeof window === 'undefined') return
    if ((window as any).JSZip) {
      jsZipLoadedRef.current = true
      return
    }
    const src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
    const s = document.createElement('script')
    s.src = src
    s.async = true
    s.onload = () => { jsZipLoadedRef.current = true }
    document.head.appendChild(s)
    return () => { document.head.removeChild(s) }
  }, [])

  const startMediaRecorder = (framerate = 60) => {
    const canvas = shaderContainerRef.current?.querySelector("canvas") as HTMLCanvasElement | null
    if (!canvas) return
    const stream = (canvas as any).captureStream ? canvas.captureStream(framerate) : null
    if (!stream) {
      console.warn("captureStream not supported in this browser")
      return
    }
    const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : (MediaRecorder.isTypeSupported('video/webm;codecs=vp8') ? 'video/webm;codecs=vp8' : 'video/webm')

    mediaChunksRef.current = []
    try {
      const mr = new MediaRecorder(stream, { mimeType: mime })
      mediaRecorderRef.current = mr
      mr.ondataavailable = (e: BlobEvent) => { if (e.data && e.data.size) mediaChunksRef.current.push(e.data) }
      mr.start()
      setIsCapturing(true)
      // auto-stop after duration if a target frame count is set
      if (targetFrameCountRef.current) {
        const seconds = targetFrameCountRef.current / framerate
        if (mediaStopTimeoutRef.current) window.clearTimeout(mediaStopTimeoutRef.current)
        mediaStopTimeoutRef.current = window.setTimeout(() => stopMediaRecorder(), Math.round(seconds * 1000))
      }
    } catch (e) {
      console.warn('MediaRecorder start failed', e)
    }
  }

  const stopMediaRecorder = () => {
    const mr = mediaRecorderRef.current
    if (!mr) return
    try {
      mr.onstop = () => {
        const blob = new Blob(mediaChunksRef.current, { type: mediaChunksRef.current[0] ? (mediaChunksRef.current[0] as any).type : 'video/webm' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'shader-recording.webm'
        a.click()
        URL.revokeObjectURL(url)
      }
      mr.stop()
    } catch (e) {
      console.warn('MediaRecorder stop failed', e)
    }
    if (mediaStopTimeoutRef.current) {
      window.clearTimeout(mediaStopTimeoutRef.current)
      mediaStopTimeoutRef.current = null
    }
    mediaRecorderRef.current = null
    // restore deterministic time and stop stepping loop when recorder stops
    if (captureLoopRef.current) {
      cancelAnimationFrame(captureLoopRef.current)
      captureLoopRef.current = null
    }
    if (originalDateNowRef.current) {
      Date.now = originalDateNowRef.current
      originalDateNowRef.current = null
    }
    targetFrameCountRef.current = null
    setIsCapturing(false)
  }

  const restoreCaptureTime = () => {
    if (captureLoopRef.current) {
      cancelAnimationFrame(captureLoopRef.current)
      captureLoopRef.current = null
    }
    if (originalDateNowRef.current) {
      Date.now = originalDateNowRef.current
      originalDateNowRef.current = null
    }
    targetFrameCountRef.current = null
  }

  const startCapture = (opts: { format?: string; framerate?: number; duration?: number } = {}) => {
    if (typeof window === "undefined") return
    const format = opts.format || 'webm'
    const framerate = opts.framerate || 60
    const duration = opts.duration || 3

    // compute target frames for perfect-loop captures
    targetFrameCountRef.current = Math.round(framerate * duration)

    // Monkey-patch Date.now to return deterministic times per-frame while capturing
    if (typeof window !== 'undefined') {
      if (!originalDateNowRef.current) originalDateNowRef.current = Date.now
      fakeFrameIndexRef.current = 0
      const start = originalDateNowRef.current()
      const msPerFrame = 1000 / framerate
      const loopMillis = Math.round(duration * 1000)
      Date.now = () => Math.round(start + ((fakeFrameIndexRef.current * msPerFrame) % loopMillis))
      // drive a simple stepping loop to increment the fake frame index on each RAF
      const step = () => {
        // stop stepping when capture finishes or aborted
        if (!isCapturing && targetFrameCountRef.current == null) {
          captureLoopRef.current = null
          return
        }
        fakeFrameIndexRef.current += 1
        captureLoopRef.current = requestAnimationFrame(step)
      }
      // start RAF stepping
      captureLoopRef.current = requestAnimationFrame(step)
    }

    // If user requested webm, prefer MediaRecorder which is more robust in-browser
    if (format === 'webm') {
      startMediaRecorder(framerate)
      return
    }

    // For PNG sequence, use a manual capture path that draws the shader canvas
    // into a 2D offscreen canvas and collects PNG Blobs. This avoids CCapture
    // internals failing when the WebGL canvas isn't preserving the buffer.
    if (format === 'png') {
      const shaderCanvas = shaderContainerRef.current?.querySelector('canvas') as HTMLCanvasElement | null
      if (!shaderCanvas) {
        console.warn('Shader canvas not found for PNG capture')
        return
      }

      const width = shaderCanvas.width
      const height = shaderCanvas.height
      const off = document.createElement('canvas')
      off.width = width
      off.height = height
      const ctx = off.getContext('2d')
      if (!ctx) {
        console.warn('Could not get 2D context for PNG capture')
        return
      }

      const total = targetFrameCountRef.current || Math.round(framerate * duration)
      const blobs: Blob[] = []
      captureFrameCountRef.current = 0
      captureAbortRef.current = false
      setCaptureProgress(0)
      setIsCapturing(true)

      const captureOne = () => {
        if (captureAbortRef.current) {
          restoreCaptureTime()
          setIsCapturing(false)
          setCaptureProgress(0)
          return
        }
        // draw current shader canvas into offscreen 2D canvas
        try {
          ctx.drawImage(shaderCanvas, 0, 0, width, height)
        } catch (e) {
          console.warn('drawImage failed during PNG capture', e)
        }
        off.toBlob((blob) => {
          if (blob) blobs.push(blob)
          captureFrameCountRef.current += 1
          setCaptureProgress(Math.round((captureFrameCountRef.current / total) * 100))
          if (captureFrameCountRef.current >= total) {
            // finished capturing frames -> zip and download
            const JSZip = (window as any).JSZip
            if (JSZip && jsZipLoadedRef.current) {
              const zip = new JSZip()
              blobs.forEach((b, i) => zip.file(`frame_${String(i).padStart(6, '0')}.png`, b))
              zip.generateAsync({ type: 'blob' }).then((zblob: Blob) => {
                const url = URL.createObjectURL(zblob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'shader-png-sequence.zip'
                a.click()
                URL.revokeObjectURL(url)
                restoreCaptureTime()
                setIsCapturing(false)
                setCaptureProgress(0)
              }).catch((err: any) => {
                console.warn('JSZip generate failed', err)
                restoreCaptureTime()
                setIsCapturing(false)
              })
            } else {
              // fallback: download first frame only
              if (blobs[0]) {
                const url = URL.createObjectURL(blobs[0])
                const a = document.createElement('a')
                a.href = url
                a.download = 'frame_000000.png'
                a.click()
                URL.revokeObjectURL(url)
              }
              restoreCaptureTime()
              setIsCapturing(false)
              setCaptureProgress(0)
            }
            return
          }
          // schedule next frame
          requestAnimationFrame(captureOne)
        }, 'image/png')
      }

      // start capturing on next animation frame to ensure shader has rendered
      requestAnimationFrame(captureOne)
      return
    }
  }

  const stopCapture = () => {
    // If MediaRecorder was used (webm fallback)
    if (mediaRecorderRef.current) {
      stopMediaRecorder()
      return
    }

    // If manual PNG capture is in progress, signal abort
    if (captureFormat === 'png' && isCapturing) {
      captureAbortRef.current = true
      // state will be reset by the capture loop
      return
    }

    if (!capturerRef.current) return
    if (captureLoopRef.current) {
      cancelAnimationFrame(captureLoopRef.current)
      captureLoopRef.current = null
    }
    // restore Date.now if we monkey-patched it
    if (originalDateNowRef.current) {
      Date.now = originalDateNowRef.current
      originalDateNowRef.current = null
    }
    try {
      capturerRef.current.stop()
      // Only call save if we captured frames. Calling save with zero frames causes CCapture internals to fail.
      if (captureFrameCountRef.current > 0) {
        try {
          capturerRef.current.save()
        } catch (e) {
          console.warn("Error saving CCapture output:", e)
        }
      } else {
        console.warn('No frames captured by CCapture; skipping save')
      }
    } catch (e) {
      console.warn("Error stopping CCapture:", e)
    }
    if (mediaStopTimeoutRef.current) {
      window.clearTimeout(mediaStopTimeoutRef.current)
      mediaStopTimeoutRef.current = null
    }
    targetFrameCountRef.current = null
    capturerRef.current = null
    setIsCapturing(false)
  }

  const toggleCapture = () => {
    if (isCapturing) stopCapture()
    else startCapture({ format: "webm", framerate: 60 })
  }

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
    <main className="relative h-[100dvh] w-full overflow-hidden bg-[#0D1B2A]">
      {!isTouchDevice && <CustomCursor />}

      {/* CCapture controls */}
      <div className="fixed top-4 right-4 z-30 flex items-center gap-2 bg-black/40 p-2 rounded">
        <select
          value={captureFormat}
          onChange={(e) => setCaptureFormat(e.target.value)}
          className="bg-white/5 text-white px-2 py-1 rounded text-sm"
        >
          <option value="webm">WebM (fast)</option>
          <option value="png">PNG sequence (lossless)</option>
        </select>

        <input
          type="number"
          min={1}
          max={120}
          value={captureFPS}
          onChange={(e) => setCaptureFPS(Number(e.target.value) || 60)}
          className="w-16 bg-white/5 text-white px-2 py-1 rounded text-sm"
          title="FPS"
        />

        <input
          type="number"
          min={1}
          max={60}
          value={captureDuration}
          onChange={(e) => setCaptureDuration(Number(e.target.value) || 3)}
          className="w-16 bg-white/5 text-white px-2 py-1 rounded text-sm"
          title="Duration (s)"
        />

        <button
          onClick={() => {
            if (isCapturing) toggleCapture()
            else startCapture({ format: captureFormat, framerate: captureFPS, duration: captureDuration })
          }}
          className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded"
        >
          {isCapturing ? "Stop" : "Record"}
        </button>
        {captureFormat === 'png' && isCapturing && (
          <span className="text-xs text-white/60 ml-2">{captureProgress}%</span>
        )}
      </div>

      <div
        ref={shaderContainerRef}
        className={`fixed inset-0 z-0 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{ contain: "strict" }}
      >
        {isTouchDevice ? (
          <div className="fixed inset-0 z-0">
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/videos/bg-poster.jpg"
              onLoadedMetadata={() => { console.log('video loadedmetadata'); setVideoStatus('loadedmetadata') }}
              onCanPlay={() => { console.log('video canplay'); setVideoStatus('canplay') }}
              onPlaying={() => { console.log('video playing'); setVideoStatus('playing'); setVideoError(null) }}
              onWaiting={() => { console.log('video waiting'); setVideoStatus('waiting') }}
              onError={(e) => {
                const el = e.currentTarget as HTMLVideoElement
                const err = el?.error
                const msg = err ? `code:${err.code} message:${(err as any).message || 'n/a'}` : 'unknown'
                console.warn('Video error event', err)
                setVideoError(msg)
                setVideoStatus('error')
              }}
            >
              <source src="/shader.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/20" />
            {videoStatus !== 'playing' && (
              <div className="pointer-events-none fixed left-4 bottom-4 z-40 rounded bg-black/60 text-white text-xs px-2 py-1">
                <div>Status: {videoStatus}</div>
                {videoError && <div className="text-red-300">Error: {videoError}</div>}
              </div>
            )}
          </div>
        ) : (
          <div ref={shaderContainerRef} className={`fixed inset-0 z-0 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
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
        )}
      </div>

      {/* <Nav currentSection={currentSection} onNavigate={scrollToSection} isLoaded={isLoaded} /> */}

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
