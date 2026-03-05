"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Plus, Star, Clock, BookOpen } from "lucide-react"
import frenchAudioData from "@/lib/french-audio.json"
import arabicAudioData from "@/lib/arabic-audio.json"

type AudioItem = (typeof frenchAudioData)[number] & { source: "french" | "arabic" }

const newBooks: AudioItem[] = [
  { ...(frenchAudioData[3] ?? {}), source: "french" },
  { ...(frenchAudioData[4] ?? {}), source: "french" },
  { ...(arabicAudioData[2] ?? {}), source: "arabic" },
  { ...(arabicAudioData[3] ?? {}), source: "arabic" },
  { ...(arabicAudioData[4] ?? {}), source: "arabic" },
].filter((item) => item && item.id) as AudioItem[]

const getBrowseBookId = (book: AudioItem) => {
  if (book.source === "french") {
    return book.id + 1000
  }
  return book.id + 2000
}

const getReactKey = (book: AudioItem) => `${book.source}-${book.id}`

export function NewArrivals() {
  const router = useRouter()
  const [hoveredBook, setHoveredBook] = useState<number | null>(null)
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

  const handlePlay = (book: AudioItem) => {
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

  return (
    <section className="py-20 bg-[#1E1E2F]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#EAEAEA] mb-4">New Arrivals</h2>
            <p className="text-[#EAEAEA]/70 text-lg">Fresh audio verses added this week</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => router.push("/browse")}
            className="border-[#3A3A55] text-[#EAEAEA] hover:bg-[#3A3A55]/50 bg-transparent"
          >
            View All
          </Button>
        </div>

        <div className="relative">
          <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
            {newBooks.map((book) => (
              <Card
                key={getReactKey(book)}
                className="flex-shrink-0 w-64 bg-gradient-to-br from-[#3A3A55]/50 to-[#1E1E2F]/50 border-[#3A3A55] backdrop-blur-sm hover:scale-105 transition-all duration-500 cursor-pointer group"
                onMouseEnter={() => setHoveredBook(book.id)}
                onMouseLeave={() => setHoveredBook(null)}
              >
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg bg-[#3A3A55]/30">
                      <img
                        src={book.cover || "/placeholder.svg"}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg"
                        }}
                      />
                      <div className="absolute top-2 right-2 z-10">
                        <span className="bg-[#FFD369] text-[#1E1E2F] text-xs font-bold px-2 py-1 rounded-full">NEW</span>
                      </div>
                      <div
                        className={`absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center transition-opacity duration-300 ${
                          hoveredBook === book.id ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <Button
                          size="icon"
                          onClick={() => handlePlay(book)}
                          className="bg-[#FFD369] text-[#1E1E2F] hover:bg-[#FFD369]/90 hover:scale-110 transition-all duration-300"
                        >
                          <Play className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[#FFD369] text-xs font-medium">
                      {book.language || (book.source === "french" ? "French" : "Arabic")}
                    </span>
                    <h3 className="font-bold text-[#EAEAEA] group-hover:text-[#FFD369] transition-colors duration-300 line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-[#EAEAEA]/70 text-sm">by {book.author}</p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-[#FFD369] fill-current" />
                        <span className="text-[#EAEAEA]">{book.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-[#EAEAEA]/70">
                        <Clock className="h-4 w-4" />
                        <span>{book.duration}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button 
                        size="sm" 
                        onClick={() => handlePlay(book)}
                        className="flex-1 bg-[#FFD369] text-[#1E1E2F] hover:bg-[#FFD369]/90"
                      >
                        <Play className="mr-1 h-3 w-3" />
                        Play
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddToLibrary(book.id)}
                        className={`border-[#3A3A55] hover:bg-[#FFD369] hover:text-[#1E1E2F] hover:border-[#FFD369] bg-transparent transition-all duration-300 ${
                          library.includes(book.id) 
                            ? "text-[#FFD369] border-[#FFD369] bg-[#FFD369]/10 hover:bg-[#FFD369] hover:text-[#1E1E2F]" 
                            : "text-[#EAEAEA]"
                        }`}
                      >
                        <BookOpen className={`h-3 w-3 ${library.includes(book.id) ? "fill-current" : ""}`} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
