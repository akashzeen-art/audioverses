"use client"

import { useEffect, useState } from "react"

export function FloatingElements() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    let raf: number

    const animate = () => {
      setScale(Math.sin(performance.now() * 0.003) * 0.5 + 1)
      raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Animated Background Orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#FFD369]/10 rounded-full blur-xl animate-float" />
      <div
        className="absolute top-40 right-20 w-24 h-24 bg-[#3A3A55]/20 rounded-full blur-lg animate-float"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-40 left-1/4 w-20 h-20 bg-[#FFD369]/15 rounded-full blur-lg animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-20 right-1/3 w-28 h-28 bg-[#3A3A55]/15 rounded-full blur-xl animate-float"
        style={{ animationDelay: "0.5s" }}
      />

      {/* Mouse Follower */}
      <div
        className="absolute w-6 h-6 bg-[#FFD369]/20 rounded-full blur-sm transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: `scale(${scale})`,
        }}
      />

      {/* Gradient Mesh */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#FFD369]/5 via-transparent to-[#3A3A55]/5 animate-pulse"
        style={{ animationDuration: "4s" }}
      />
    </div>
  )
}
