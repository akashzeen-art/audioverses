"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Play, Mic, Sparkles, BookOpen, Users } from "lucide-react"
import { WaveformAnimation } from "@/components/waveform-animation"

export function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentWord, setCurrentWord] = useState(0)

  const heroWords = ["Listen", "Learn", "Discover", "Experience"]

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % heroWords.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.play().catch((err) => console.error("Playback failed:", err))
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden pt-24">
      {/* 🔥 Background Video */}
      <div className="absolute inset-0 w-full h-[81%]">
        <video
          className="w-full h-full object-cover"
          src="/8074ae3fd2457d9bfec04fbf896dd36e.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
            <span className="text-[#EAEAEA] block mb-2">Transform How You </span>
            <span className="gradient-text inline-block">
              {heroWords[currentWord]}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-[#EAEAEA]/80 max-w-3xl mx-auto leading-relaxed font-light">
            Experience premium audio verses with AI-generated voices that bring
            stories to life. Choose from multiple voice styles and enjoy seamless
            listening across all devices.
          </p>

          {/* Waveform Animation */}
          <div className="py-12">
            <div className="glass-strong rounded-2xl p-8 max-w-2xl mx-auto hover-glow-strong">
              <div className="h-24 w-full flex items-center justify-center">
                <WaveformAnimation isPlaying={isPlaying} />
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button
              size="lg"
              className="bg-[#FFD369] text-[#1E1E2F] hover:bg-[#FFD369]/90 hover:scale-110 transition-all duration-500 shadow-2xl hover:shadow-[#FFD369]/40 px-12 py-8 text-xl font-bold rounded-2xl"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              <Play className="mr-3 h-6 w-6" />
              {isPlaying ? "Pause" : "Start Listening Free"}
            </Button>

            {/* 🎵 Hidden audio element */}
            <audio ref={audioRef} src="/audio2.mp3" preload="auto" />
          </div>
        </div>
      </div>

      {/* ✅ Stats Section */}
      <div className="relative z-10 container mx-auto px-4 text-center mt-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: "500+", label: "Audiobooks", icon: BookOpen },
            { number: "50+", label: "AI Voices", icon: Mic },
            { number: "1M+", label: "Happy Users", icon: Users },
            { number: "4.9★", label: "Rating", icon: Sparkles },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center group hover-glow glass rounded-xl p-6"
            >
              <stat.icon className="w-8 h-8 text-[#FFD369] mx-auto mb-3 group-hover:animate-bounce" />
              <div className="text-3xl md:text-4xl font-bold gradient-text group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-[#EAEAEA]/70 text-base md:text-lg font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-[#FFD369]/70 rounded-full flex justify-center hover:border-[#FFD369] transition-colors duration-300 glass">
          <div className="w-2 h-4 bg-[#FFD369] rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
