"use client"

import { Clock } from "lucide-react"
import portugueseAudio from "@/lib/portuguese-audio.json"

const parseDurationToHours = (durationSeconds?: number) => {
  if (!durationSeconds || durationSeconds <= 0) return 0
  return durationSeconds / 3600
}

interface PortugueseSectionProps {
  onClick: () => void
}

export default function PortugueseSection({ onClick }: PortugueseSectionProps) {
  const totalHours = portugueseAudio
    .reduce((acc, audio) => acc + parseDurationToHours(audio.durationSeconds), 0)
    .toFixed(1)

  return (
    <div
      className="bg-[#3A3A55]/30 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-[#3A3A55]/50 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
        <h3 className="text-lg sm:text-xl font-bold text-[#EAEAEA]">Portuguese Audio</h3>
        <div className="bg-[#FFD369] text-[#1E1E2F] px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
          {portugueseAudio.length} titles
        </div>
      </div>
      <p className="text-[#EAEAEA]/70 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
        Explore Portuguese and Brazilian literature through our curated collection of Portuguese audio verses
      </p>
      <div className="flex items-center text-[#EAEAEA]/60 text-xs sm:text-sm flex-wrap">
        <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
        <span className="truncate">Total: {totalHours}h of content</span>
      </div>
    </div>
  )
}
