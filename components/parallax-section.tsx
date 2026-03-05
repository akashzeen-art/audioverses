"use client"

import { useEffect, useState } from "react"
import { Headphones, Mic, Volume2, Play } from "lucide-react"

export function ParallaxSection() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="relative h-96 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#1E1E2F] via-[#3A3A55]/30 to-[#1E1E2F]" />

      {/* Parallax Icons */}
      <div className="absolute inset-0">
        <Headphones
          className="absolute top-20 left-20 w-8 h-8 text-[#FFD369]/30"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        <Mic
          className="absolute top-32 right-32 w-6 h-6 text-[#FFD369]/20"
          style={{ transform: `translateY(${scrollY * -0.2}px)` }}
        />
        <Volume2
          className="absolute bottom-20 left-1/3 w-10 h-10 text-[#FFD369]/25"
          style={{ transform: `translateY(${scrollY * 0.4}px)` }}
        />
        <Play
          className="absolute bottom-32 right-20 w-7 h-7 text-[#FFD369]/30"
          style={{ transform: `translateY(${scrollY * -0.3}px)` }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold gradient-text mb-4">Experience Audio</h2>
          <p className="text-xl text-[#EAEAEA]/70 max-w-2xl mx-auto">Like Never Before</p>
        </div>
      </div>
    </section>
  )
}
