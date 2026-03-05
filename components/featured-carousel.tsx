"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Play, Star, BookOpen } from "lucide-react"
import frenchAudioData from "@/lib/french-audio.json"
import arabicAudioData from "@/lib/arabic-audio.json"

type AudioItem = (typeof frenchAudioData)[number] & { source: "french" | "arabic" }

const featuredBooks: AudioItem[] = [
  { ...(frenchAudioData[0] ?? {}), source: "french" },
  { ...(frenchAudioData[1] ?? {}), source: "french" },
  { ...(frenchAudioData[2] ?? {}), source: "french" },
  { ...(arabicAudioData[0] ?? {}), source: "arabic" },
  { ...(arabicAudioData[1] ?? {}), source: "arabic" },
].filter((item) => item && item.id) as AudioItem[]

const getBrowseBookId = (book: AudioItem) => {
  if (book.source === "french") {
    return book.id + 1000
  }
  return book.id + 2000
}

const getReactKey = (book: AudioItem) => `${book.source}-${book.id}`

export function FeaturedCarousel() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [library, setLibrary] = useState<number[]>([])

  useEffect(() => {
    const savedLibrary = typeof window !== "undefined" ? localStorage.getItem("audiobook-library") : null
    if (savedLibrary) {
      setLibrary(JSON.parse(savedLibrary))
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("audiobook-library", JSON.stringify(library))
    }
  }, [library])

  useEffect(() => {
    if (!isAutoPlaying || featuredBooks.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredBooks.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const handlePlayNow = (book: AudioItem) => {
    const browseBookId = getBrowseBookId(book)
    router.push(`/browse?bookId=${browseBookId}`)
  }

  const handleAddToLibrary = (bookId: number) => {
    setLibrary((prev) => {
      if (prev.includes(bookId)) {
        return prev.filter((id) => id !== bookId)
      }
      return [...prev, bookId]
    })
  }

  const nextSlide = () => {
    if (!featuredBooks.length) return
    setCurrentIndex((prev) => (prev + 1) % featuredBooks.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    if (!featuredBooks.length) return
    setCurrentIndex((prev) => (prev - 1 + featuredBooks.length) % featuredBooks.length)
    setIsAutoPlaying(false)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-[#1E1E2F] to-[#3A3A55]/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#EAEAEA] mb-4">Featured Audio Verses</h2>
          <p className="text-[#EAEAEA]/70 text-lg max-w-2xl mx-auto">
            Discover our handpicked selection of premium audio verses with AI-generated narration
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {featuredBooks.map((book) => (
                <div key={getReactKey(book)} className="w-full flex-shrink-0 px-4">
                  <Card className="bg-gradient-to-br from-[#3A3A55]/50 to-[#1E1E2F]/50 border-[#3A3A55] backdrop-blur-sm hover:scale-105 transition-all duration-500 group">
                    <CardContent className="p-8">
                      <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="relative group-hover:scale-105 transition-transform duration-500">
                          <div className="w-full max-w-sm mx-auto rounded-lg shadow-2xl overflow-hidden aspect-[3/4] bg-[#151525]">
                            <img
                            src={book.cover || "/placeholder.svg"}
                            alt={book.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/placeholder.svg"
                              }}
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <Button
                            size="icon"
                            onClick={() => handlePlayNow(book)}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#FFD369] text-[#1E1E2F] hover:bg-[#FFD369]/90 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 hover:scale-100"
                          >
                            <Play className="h-6 w-6" />
                          </Button>
                        </div>

                        <div className="space-y-6">
                          <div>
                            <span className="text-[#FFD369] text-sm font-medium">
                              {book.language || (book.source === "french" ? "French" : "Arabic")}
                            </span>
                            <h3 className="text-2xl md:text-3xl font-bold text-[#EAEAEA] mt-2">{book.title}</h3>
                            <p className="text-[#EAEAEA]/70 text-lg">{book.author}</p>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Star className="h-5 w-5 text-[#FFD369] fill-current" />
                              <span className="text-[#EAEAEA] font-medium">{book.rating}</span>
                            </div>
                            <span className="text-[#EAEAEA]/70">{book.duration}</span>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4">
                            <Button 
                              onClick={() => handlePlayNow(book)}
                              className="bg-[#FFD369] text-[#1E1E2F] hover:bg-[#FFD369]/90 hover:scale-105 transition-all duration-300"
                            >
                              <Play className="mr-2 h-4 w-4" />
                              Play Now
                            </Button>
                            <Button
                              onClick={() => handleAddToLibrary(book.id)}
                              variant="outline"
                              className={`border-[#3A3A55] hover:bg-[#FFD369] hover:text-[#1E1E2F] hover:border-[#FFD369] bg-transparent transition-all duration-300 ${
                                library.includes(book.id) 
                                  ? "text-[#FFD369] border-[#FFD369] bg-[#FFD369]/10 hover:bg-[#FFD369] hover:text-[#1E1E2F]" 
                                  : "text-[#EAEAEA]"
                              }`}
                            >
                              <BookOpen className={`mr-2 h-4 w-4 ${library.includes(book.id) ? "fill-current" : ""}`} />
                              {library.includes(book.id) ? "In Library" : "Add to Library"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#1E1E2F]/80 border-[#3A3A55] text-[#EAEAEA] hover:bg-[#3A3A55]/50 backdrop-blur-sm"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#1E1E2F]/80 border-[#3A3A55] text-[#EAEAEA] hover:bg-[#3A3A55]/50 backdrop-blur-sm"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <div className="flex justify-center space-x-2 mt-8">
            {featuredBooks.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-[#FFD369] scale-125" : "bg-[#3A3A55] hover:bg-[#FFD369]/50"
                }`}
                onClick={() => {
                  setCurrentIndex(index)
                  setIsAutoPlaying(false)
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
