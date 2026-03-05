"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2 } from "lucide-react"
import { WaveformAnimation } from "@/components/waveform-animation"
import categoryMapping from "@/lib/category-mapping.json"

const voiceOptions = [
  {
    id: 1,
    name: "Emma",
    type: "Warm & Friendly",
    accent: "American",
    description: "Perfect for romance and contemporary fiction",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces&auto=format",
  },
  {
    id: 2,
    name: "James",
    type: "Deep & Authoritative",
    accent: "British",
    description: "Ideal for thrillers and non-fiction",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces&auto=format",
  },
  {
    id: 3,
    name: "Sofia",
    type: "Elegant & Sophisticated",
    accent: "European",
    description: "Great for literary fiction and classics",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces&auto=format",
  },
  {
    id: 4,
    name: "Marcus",
    type: "Energetic & Dynamic",
    accent: "Australian",
    description: "Perfect for adventure and sci-fi",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces&auto=format",
  },
]

const getSampleAudioForVoice = (voiceId: number): string | null => {
  const categoryMap: Record<number, string[]> = {
    1: ["Romance", "Fiction"], // Emma - romance/contemporary fiction
    2: ["Thriller", "Non-Fiction"], // James - thrillers/non-fiction
    3: ["Fiction", "Biography"], // Sofia - literary fiction/classics
    4: ["Sci-Fi", "Fantasy"], // Marcus - adventure/sci-fi
  }
  
  const categories = categoryMap[voiceId] || []
  for (const category of categories) {
    const categoryData = categoryMapping[category as keyof typeof categoryMapping]
    if (categoryData?.sample_audio) {
      return categoryData.sample_audio
    }
    if (categoryData?.books && categoryData.books.length > 0) {
      return categoryData.books[0].audio || null
    }
  }
  return null
}

export function AIVoiceDemo() {
  const [playingVoice, setPlayingVoice] = useState<number | null>(null)
  const audioRefs = useRef<Map<number, HTMLAudioElement>>(new Map())
  const router = useRouter()

  useEffect(() => {
    return () => {
      audioRefs.current.forEach((audio) => {
        if (audio) {
          audio.pause()
          audio.src = ""
        }
      })
    }
  }, [])

  const togglePlay = async (voiceId: number) => {
    if (playingVoice !== null && playingVoice !== voiceId) {
      const currentAudio = audioRefs.current.get(playingVoice)
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.currentTime = 0
      }
    }

    let audio = audioRefs.current.get(voiceId)
    if (!audio) {
      audio = new Audio()
      const sampleAudioUrl = getSampleAudioForVoice(voiceId)
      if (sampleAudioUrl) {
        audio.src = sampleAudioUrl
        audioRefs.current.set(voiceId, audio)
      } else {
        return // No audio available
      }
    }

    if (playingVoice === voiceId) {
      audio.pause()
      setPlayingVoice(null)
    } else {
      try {
        await audio.play()
        setPlayingVoice(voiceId)
        
        // Handle audio end
        audio.onended = () => {
          setPlayingVoice(null)
        }
        
        // Handle errors
        audio.onerror = () => {
          setPlayingVoice(null)
          console.error(`Failed to play audio for ${voiceOptions.find(v => v.id === voiceId)?.name}`)
        }
      } catch (error) {
        console.error("Playback failed:", error)
        setPlayingVoice(null)
      }
    }
  }

  return (
    <section className="py-20 bg-[#1E1E2F]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#EAEAEA] mb-4">Experience AI Narration</h2>
          <p className="text-[#EAEAEA]/70 text-lg max-w-3xl mx-auto">
            Listen to sample narrations from our diverse collection of AI voices. Each voice is carefully crafted to
            bring stories to life with emotion and personality.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Sample Text */}
          <Card className="bg-gradient-to-br from-[#3A3A55]/50 to-[#1E1E2F]/50 border-[#3A3A55] backdrop-blur-sm mb-12">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-bold text-[#FFD369] mb-4">Sample Text</h3>
              <p className="text-[#EAEAEA] text-lg leading-relaxed italic">
                "The morning sun cast long shadows across the digital farm, where rows of data grew like crops in the
                virtual soil. Sarah walked between the servers, her footsteps echoing in the quiet hum of technology
                that had revolutionized agriculture forever."
              </p>
            </CardContent>
          </Card>

          {/* Voice Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {voiceOptions.map((voice) => (
              <Card
                key={voice.id}
                className="bg-gradient-to-br from-[#3A3A55]/50 to-[#1E1E2F]/50 border-[#3A3A55] backdrop-blur-sm hover:scale-105 transition-all duration-500 group"
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <img
                        src={voice.avatar || "/placeholder.svg"}
                        alt={voice.name}
                        className="w-16 h-16 rounded-full border-2 border-[#FFD369]/30 group-hover:border-[#FFD369] transition-colors duration-300 object-cover"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg"
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-[#EAEAEA] group-hover:text-[#FFD369] transition-colors duration-300">
                        {voice.name}
                      </h4>
                      <p className="text-[#FFD369] text-sm">{voice.type}</p>
                      <p className="text-[#EAEAEA]/70 text-sm">{voice.accent} Accent</p>
                    </div>
                  </div>

                  <p className="text-[#EAEAEA]/70 text-sm mb-4">{voice.description}</p>

                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      className={`transition-all duration-300 flex-shrink-0 ${
                        playingVoice === voice.id
                          ? "bg-[#FFD369] text-[#1E1E2F] hover:bg-[#FFD369]/90"
                          : "bg-[#3A3A55] text-[#EAEAEA] hover:bg-[#FFD369] hover:text-[#1E1E2F]"
                      }`}
                      onClick={() => togglePlay(voice.id)}
                    >
                      {playingVoice === voice.id ? (
                        <Pause className="mr-2 h-4 w-4" />
                      ) : (
                        <Play className="mr-2 h-4 w-4" />
                      )}
                      {playingVoice === voice.id ? "Pause" : "Play Sample"}
                    </Button>

                    {playingVoice === voice.id && (
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Volume2 className="h-4 w-4 text-[#FFD369] flex-shrink-0" />
                        <div className="flex-1 h-8 min-w-0 overflow-hidden flex items-center">
                          <WaveformAnimation isPlaying={true} />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Button
              onClick={() => router.push("/browse?section=voices")}
              className="bg-[#FFD369] text-[#1E1E2F] hover:bg-[#FFD369]/90 hover:scale-105 transition-all duration-300 px-8 py-3 text-lg"
            >
              Explore All Voice Options
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
