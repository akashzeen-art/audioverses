"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Mic, MicOff } from "lucide-react"

export function SearchSection() {
  const router = useRouter()
  const [isListening, setIsListening] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const toggleVoiceSearch = () => {
    setIsListening(!isListening)
    // In a real app, this would start/stop voice recognition
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handlePopularSearch = (tag: string) => {
    router.push(`/browse?search=${encodeURIComponent(tag)}`)
  }

  return (
    <section className="py-16 bg-[#1E1E2F]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#EAEAEA] mb-8">Find Your Next Great Listen</h2>

          <form onSubmit={handleSearch} className="relative group">
            <div className="flex items-center bg-gradient-to-r from-[#3A3A55]/50 to-[#3A3A55]/30 backdrop-blur-sm rounded-2xl border border-[#3A3A55] p-2 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[#FFD369]/10">
              <Search className="h-6 w-6 text-[#EAEAEA]/70 ml-4" />
              <Input
                type="text"
                placeholder="Search by title, author, genre, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(e)
                  }
                }}
                className="flex-1 bg-transparent border-none text-[#EAEAEA] placeholder:text-[#EAEAEA]/50 text-lg px-4 focus:outline-none"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`mr-2 transition-all duration-300 ${
                  isListening
                    ? "text-[#FFD369] bg-[#FFD369]/20 animate-pulse"
                    : "text-[#EAEAEA]/70 hover:text-[#FFD369] hover:bg-[#FFD369]/10"
                }`}
                onClick={toggleVoiceSearch}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              <Button 
                type="submit"
                className="bg-[#FFD369] text-[#1E1E2F] hover:bg-[#FFD369]/90 hover:scale-105 transition-all duration-300 px-8"
              >
                Search
              </Button>
            </div>

            {isListening && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-[#3A3A55]/90 backdrop-blur-sm rounded-lg px-4 py-2 text-[#FFD369] text-sm animate-pulse">
                🎤 Listening... Speak now
              </div>
            )}
          </form>

          {/* Popular Searches */}
          <div className="mt-8">
            <p className="text-[#EAEAEA]/70 mb-4">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Science Fiction", "Mystery", "Self-Help", "Biography", "Fantasy", "Business"].map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-[#3A3A55] text-[#EAEAEA]/80 hover:bg-[#FFD369] hover:text-[#1E1E2F] hover:border-[#FFD369] transition-all duration-300 bg-transparent"
                  onClick={() => handlePopularSearch(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
