"use client"

interface WaveformAnimationProps {
  isPlaying: boolean
}

export function WaveformAnimation({ isPlaying }: WaveformAnimationProps) {
  // Create 40 bars with staggered animation delays (0ms to 1950ms in 50ms increments)
  const numberOfBars = 40

  return (
    <div className="flex items-end justify-center space-x-1 h-full w-full">
      {Array.from({ length: numberOfBars }).map((_, index) => {
        const animationDelay = index * 50 // Stagger by 50ms (0ms to 1950ms)
        return (
          <div
            key={index}
            className={`bg-gradient-to-t from-[#FFD369] to-[#FFD369]/60 rounded-full transition-all duration-150 ease-in-out ${
              isPlaying ? "animate-waveform" : ""
            }`}
            style={{
              width: "4px",
              height: "20%",
              animationDelay: isPlaying ? `${animationDelay}ms` : "0ms",
              opacity: isPlaying ? 1 : 0.5,
              transition: "height 0.15s ease-in-out, opacity 0.15s ease-in-out",
            }}
          />
        )
      })}
    </div>
  )
}
