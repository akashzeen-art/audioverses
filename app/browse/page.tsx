"use client"

import { useRef, useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Clock, Star, Play, Pause, Languages, X } from "lucide-react"
import frenchAudio from "@/lib/french-audio.json"
import arabicAudio from "@/lib/arabic-audio.json"
import portugueseAudio from "@/lib/portuguese-audio.json"
import polishAudio from "@/lib/polish-audio.json"
import czechAudio from "@/lib/czech-audio.json"
import categoryMapping from "@/lib/category-mapping.json"
import PortugueseSection from "@/components/PortugueseSection"
import PolishSection from "@/components/PolishSection"
import CzechSection from "@/components/CzechSection"

export const dynamic = 'force-dynamic'
export const dynamicParams = true

// Book type
type Book = {
  id: number
  title: string
  author: string
  duration: string
  rating: number
  cover: string
  category: string
  audio: string
  language?: string
  description?: string
  durationSeconds?: number
}

function BrowsePageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categories: string[] = [
    "All",
    "French",
    "Arabic",
    "Portuguese",
    "Polish",
    "Czech",
    "Fiction","Non-Fiction","Mystery","Romance","Sci-Fi","Biography",
    "Self-Help","Business","History","Fantasy","Thriller","Children",
    "Travel","Sports","Science","Home","Health","Education","Computer",
  ]
  const fillerCategories = categories.filter(
    (category) => !["All", "French", "Arabic", "Portuguese", "Polish", "Czech"].includes(category)
  )

  const defaultAudio = ""

  const parseDurationToSeconds = (value?: string | number) => {
    if (typeof value === "number") {
      return Number.isFinite(value) ? Math.round(Math.max(0, value)) : 0
    }
    if (!value) return 0
    const normalized = value.trim()
    if (!normalized) return 0
    const numeric = Number(normalized)
    if (Number.isFinite(numeric)) return Math.round(Math.max(0, numeric))

    const hoursMatch = normalized.match(/([0-9.]+)\s*h/i)
    const minutesMatch = normalized.match(/([0-9.]+)\s*m/i)
    const secondsMatch = normalized.match(/([0-9.]+)\s*s/i)

    const hours = hoursMatch ? parseFloat(hoursMatch[1]) * 3600 : 0
    const minutes = minutesMatch ? parseFloat(minutesMatch[1]) * 60 : 0
    const seconds = secondsMatch ? parseFloat(secondsMatch[1]) : 0

    const total = hours + minutes + seconds
    return Number.isFinite(total) ? Math.round(total) : 0
  }

  const parseDurationToHours = (value?: string | number) => {
    const seconds = parseDurationToSeconds(value)
    return Number.isFinite(seconds) ? seconds / 3600 : 0
  }

  // Create audio URL to duration lookup from French and Arabic audio files
  const audioDurationMap = new Map<string, { duration: string; durationSeconds: number }>()
  
  // Add French audio durations
  frenchAudio.forEach((audio: any) => {
    if (audio.audio && audio.durationSeconds !== undefined) {
      const normalizedUrl = audio.audio.trim()
      audioDurationMap.set(normalizedUrl, {
        duration: audio.duration || "0h 0m 0s",
        durationSeconds: audio.durationSeconds || 0
      })
    }
  })
  
  // Add Arabic audio durations
  arabicAudio.forEach((audio: any) => {
    if (audio.audio && audio.durationSeconds !== undefined) {
      const normalizedUrl = audio.audio.trim()
      audioDurationMap.set(normalizedUrl, {
        duration: audio.duration || "0h 0m 0s",
        durationSeconds: audio.durationSeconds || 0
      })
    }
  })

  // Generate category books from mapping (using English titles and accurate durations)
  const categoryBooks: Book[] = []
  const bookTitlesByCategory: Record<string, string[]> = {
    "Fiction": ["The Mystery of Time", "Echoes of the Past", "Whispers in the Wind", "The Last Chapter", "Shadows and Light", "The Final Quest", "Beyond the Horizon"],
    "Non-Fiction": ["Real Stories", "Truth and Facts", "Learning Journey", "Knowledge Base", "Insightful Reading", "Educational Content", "Factual Accounts"],
    "Mystery": ["The Hidden Secret", "Unraveling Truth", "Dark Mysteries", "The Enigma", "Secrets Unveiled", "Mysterious Tales", "The Puzzle"],
    "Romance": ["Love Stories", "Heart's Desire", "Romantic Tales", "The Beloved", "Love and Romance", "Hearts United", "Romantic Journey"],
    "Sci-Fi": ["Future Worlds", "Space Adventures", "Tech Frontiers", "Alien Encounters", "Future Tales", "Science Fiction", "Space Odyssey"],
    "Biography": ["Life Stories", "Remarkable Lives", "Personal Journey", "Biographical Tales", "Life Accounts", "Notable People", "Life History"],
    "Self-Help": ["Personal Growth", "Self Improvement", "Life Guidance", "Better Living", "Growth Path", "Self Development", "Life Skills"],
    "Business": ["Business Success", "Career Growth", "Business Strategy", "Professional Growth", "Business Insights", "Career Path", "Business Wisdom"],
    "History": ["Historical Tales", "Past Events", "History Stories", "Ancient Times", "Historical Accounts", "Past Chronicles", "History Lessons"],
    "Fantasy": ["Magical Worlds", "Fantasy Tales", "Mythical Stories", "Enchanted Lands", "Fantasy Adventures", "Magical Journeys", "Fantasy Realms"],
    "Thriller": ["Thrilling Tales", "Suspense Stories", "Edge of Seat", "Thrilling Adventures", "Suspenseful Tales", "Action Packed", "Thriller Stories"],
    "Children": ["Children's Stories", "Kids Tales", "Young Adventures", "Kids Books", "Children Tales", "Young Stories", "Kids Adventures"]
  }
  
  fillerCategories.forEach((category, idx) => {
    const categoryData = categoryMapping[category as keyof typeof categoryMapping]
    const titles = bookTitlesByCategory[category] || [`${category} Book ${idx + 1}`]
    if (categoryData?.books) {
      categoryData.books.forEach((bookData: any, bookIdx: number) => {
        const titleIndex = bookIdx % titles.length
        const audioUrl = (bookData.audio || "").trim()
        
        // Look up duration from audio URL
        let duration = "1h 0m 0s"
        let durationSeconds = 3600
        
        if (audioUrl) {
          // Normalize URL for better matching (decode URL encoding)
          const normalizeUrl = (url: string) => {
            try {
              return decodeURIComponent(url).toLowerCase().trim()
            } catch {
              return url.toLowerCase().trim()
            }
          }
          
          const normalizedAudioUrl = normalizeUrl(audioUrl)
          
          // Try exact match first
          const exactMatch = audioDurationMap.get(audioUrl)
          if (exactMatch) {
            duration = exactMatch.duration
            durationSeconds = exactMatch.durationSeconds
          } else {
            // Try normalized match (handle URL encoding differences)
            for (const [url, durationData] of audioDurationMap.entries()) {
              const normalizedUrl = normalizeUrl(url)
              if (normalizedUrl === normalizedAudioUrl) {
                duration = durationData.duration
                durationSeconds = durationData.durationSeconds
                break
              }
            }
            
            // If still no match, try partial match by filename
            if (durationSeconds === 3600) {
              const audioFileName = audioUrl.split('/').pop() || ''
              for (const [url, durationData] of audioDurationMap.entries()) {
                const urlFileName = url.split('/').pop() || ''
                if (normalizeUrl(audioFileName) === normalizeUrl(urlFileName)) {
                  duration = durationData.duration
                  durationSeconds = durationData.durationSeconds
                  break
                }
              }
            }
          }
        }
        
        // Format duration in HH:MM:SS if we have durationSeconds
        if (durationSeconds > 0) {
          const hours = Math.floor(durationSeconds / 3600)
          const minutes = Math.floor((durationSeconds % 3600) / 60)
          const seconds = durationSeconds % 60
          
          if (hours > 0) {
            duration = `${hours}h ${minutes}m ${seconds}s`
          } else if (minutes > 0) {
            duration = `${minutes}m ${seconds}s`
          } else {
            duration = `${seconds}s`
          }
        }
        
        categoryBooks.push({
          id: 3000 + (idx * 100) + bookIdx,
          title: titles[titleIndex] || `${category} Book ${bookIdx + 1}`,
          author: `Author ${bookIdx + 1}`,
          duration: duration,
          durationSeconds: durationSeconds,
          rating: 4.5,
          cover: bookData.image || "/placeholder.svg",
          category: category,
          audio: bookData.audio || "",
          description: `${category} audiobook ${bookIdx + 1}`,
        })
      })
    }
  })

  // Collect all unique audio files from category mapping for additional books
  const allAudioFiles: Array<{ audio: string; image: string }> = []
  Object.values(categoryMapping).forEach((categoryData: any) => {
    if (categoryData?.books) {
      categoryData.books.forEach((book: any) => {
        if (book.audio && book.image) {
          allAudioFiles.push({
            audio: book.audio,
            image: book.image
          })
        }
      })
    }
  })

  // Generate additional books with exact durations, ratings, and audio files from APIs
  const additionalBooksData = [
    { hours: 5, minutes: 10, seconds: 0, rating: 4.0 },
    { hours: 6, minutes: 15, seconds: 17, rating: 4.1 },
    { hours: 7, minutes: 20, seconds: 34, rating: 4.2 },
    { hours: 8, minutes: 25, seconds: 51, rating: 4.3 },
    { hours: 5, minutes: 30, seconds: 8, rating: 4.4 },
    { hours: 6, minutes: 35, seconds: 25, rating: 4.0 },
    { hours: 7, minutes: 40, seconds: 42, rating: 4.1 },
    { hours: 8, minutes: 45, seconds: 59, rating: 4.2 },
    { hours: 5, minutes: 50, seconds: 16, rating: 4.3 },
    { hours: 6, minutes: 55, seconds: 33, rating: 4.4 },
    { hours: 7, minutes: 10, seconds: 50, rating: 4.0 },
    { hours: 8, minutes: 15, seconds: 7, rating: 4.1 },
    { hours: 5, minutes: 20, seconds: 24, rating: 4.2 },
    { hours: 6, minutes: 25, seconds: 41, rating: 4.3 },
    { hours: 7, minutes: 30, seconds: 58, rating: 4.4 },
    { hours: 8, minutes: 35, seconds: 15, rating: 4.0 },
    { hours: 5, minutes: 40, seconds: 32, rating: 4.1 },
    { hours: 6, minutes: 45, seconds: 49, rating: 4.2 },
    { hours: 7, minutes: 50, seconds: 6, rating: 4.3 },
    { hours: 8, minutes: 55, seconds: 23, rating: 4.4 },
  ]

  const additionalBooks: Book[] = additionalBooksData.map((bookData, i) => {
    const { hours, minutes, seconds, rating } = bookData
    const durationSeconds = hours * 3600 + minutes * 60 + seconds
    
    // Format duration in HH:MM:SS
    const duration = `${hours}h ${minutes}m ${seconds}s`
    
    // Get audio and image from category mapping (cycle through available files)
    const audioFile = allAudioFiles[i % allAudioFiles.length] || {
      audio: "",
      image: "/placeholder.svg"
    }
    
    // Look up duration from audio URL if available
    let finalDuration = duration
    let finalDurationSeconds = durationSeconds
    const audioUrl = audioFile.audio.trim()
    if (audioUrl) {
      // Try exact match first
      const exactMatch = audioDurationMap.get(audioUrl)
      if (exactMatch && exactMatch.durationSeconds > 0) {
        finalDuration = exactMatch.duration
        finalDurationSeconds = exactMatch.durationSeconds
        
        // Format duration in HH:MM:SS if we have durationSeconds
        if (finalDurationSeconds > 0) {
          const h = Math.floor(finalDurationSeconds / 3600)
          const m = Math.floor((finalDurationSeconds % 3600) / 60)
          const s = finalDurationSeconds % 60
          
          if (h > 0) {
            finalDuration = `${h}h ${m}m ${s}s`
          } else if (m > 0) {
            finalDuration = `${m}m ${s}s`
          } else {
            finalDuration = `${s}s`
          }
        }
      } else {
        // Try normalized match
        const normalizeUrl = (url: string) => {
          try {
            return decodeURIComponent(url).toLowerCase().trim()
          } catch {
            return url.toLowerCase().trim()
          }
        }
        
        const normalizedAudioUrl = normalizeUrl(audioUrl)
        for (const [url, durationData] of audioDurationMap.entries()) {
          const normalizedUrl = normalizeUrl(url)
          if (normalizedUrl === normalizedAudioUrl && durationData.durationSeconds > 0) {
            finalDuration = durationData.duration
            finalDurationSeconds = durationData.durationSeconds
            
            // Format duration in HH:MM:SS
            const h = Math.floor(finalDurationSeconds / 3600)
            const m = Math.floor((finalDurationSeconds % 3600) / 60)
            const s = finalDurationSeconds % 60
            
            if (h > 0) {
              finalDuration = `${h}h ${m}m ${s}s`
            } else if (m > 0) {
              finalDuration = `${m}m ${s}s`
            } else {
              finalDuration = `${s}s`
            }
            break
          }
        }
      }
    }
    
    return {
      id: 5000 + i + 1,
    title: `Book Title ${i + 1}`,
    author: `Author ${i + 1}`,
      duration: finalDuration,
      durationSeconds: finalDurationSeconds,
      rating: rating,
      cover: audioFile.image || `https://picsum.photos/200/300?random=${i + 1}`,
      category: fillerCategories[i % fillerCategories.length],
      audio: audioFile.audio || "",
    }
  })

  // Combine all audio content
  // ID ranges: French (1000-1999), Arabic (2000-2999), Portuguese (4000-4999), Polish (6000-6999), Czech (7000-7999), Category Books (3000-3999), Additional (10000+)
  const allAudioContent: Book[] = [
    ...frenchAudio.map(audio => ({ ...audio, id: audio.id + 1000 })),
    ...arabicAudio.map(audio => ({ ...audio, id: audio.id + 2000 })),
    ...portugueseAudio.map(audio => ({ ...audio, id: audio.id + 4000 })),
    ...polishAudio.map(audio => ({ ...audio, id: audio.id + 6000 })),
    ...czechAudio.map(audio => ({ ...audio, id: audio.id + 7000 })),
    ...categoryBooks,
    ...additionalBooks.map((book, i) => ({ ...book, id: 10000 + i + 1 }))
  ]

  const [currentBook, setCurrentBook] = useState<Book | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [resumeMessage, setResumeMessage] = useState<string | null>(null)
  const [bookDurations, setBookDurations] = useState<Map<number, number>>(new Map())
  const audioRef = useRef<HTMLAudioElement>(null)
  const isPlayingRef = useRef(false)
  const rafRef = useRef<number | null>(null)

  // Prefill slider duration when metadata is missing
  useEffect(() => {
    if (!currentBook) return
    const fallbackSeconds =
      currentBook.durationSeconds && currentBook.durationSeconds > 0
        ? currentBook.durationSeconds
        : parseDurationToSeconds(currentBook.duration)
    if (fallbackSeconds > 0) {
      setDuration(fallbackSeconds)
    }
  }, [currentBook])

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatHHMMSS = (value: number) => {
    if (!Number.isFinite(value) || value < 0) return "00:00"
    const totalSeconds = Math.floor(value)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    const hh = hours > 0 ? `${hours.toString().padStart(2, "0")}:` : ""
    const mm = minutes.toString().padStart(2, "0")
    const ss = seconds.toString().padStart(2, "0")
    return `${hh}${mm}:${ss}`
  }

  // Initialize and update selectedCategory and searchQuery when URL parameter changes
  useEffect(() => {
    const categoryParam = searchParams.get("category")
    if (categoryParam) {
      const decodedCategory = decodeURIComponent(categoryParam)
      const normalized = categories.find((cat) => cat.toLowerCase() === decodedCategory.toLowerCase())
      if (normalized) {
        setSelectedCategory(normalized)
      }
    } else {
      setSelectedCategory("All")
    }

    const searchParam = searchParams.get("search")
    if (searchParam) {
      const decodedSearch = decodeURIComponent(searchParam)
      setSearchQuery(decodedSearch)
      
      // If search matches a category name, also update the selected category
      const matchedCategory = categories.find(
        cat => cat.toLowerCase() === decodedSearch.toLowerCase() || 
               cat.toLowerCase().includes(decodedSearch.toLowerCase())
      )
      if (matchedCategory && !categoryParam) {
        setSelectedCategory(matchedCategory)
      }
    } else {
      setSearchQuery("")
    }
  }, [searchParams])

  // Handle deep-link sections (e.g., from "Explore All Voice Options" CTA)
  useEffect(() => {
    const sectionParam = searchParams.get("section")
    if (sectionParam === "voices") {
      // Delay scrolling slightly to ensure layout is ready
      const timeout = setTimeout(() => {
        const target = document.getElementById("language-categories")
        target?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 200)
      return () => clearTimeout(timeout)
    }
  }, [searchParams])

  // Handle resume playback from Library page
  useEffect(() => {
    const resumeParam = searchParams.get("resume")
    if (!resumeParam) return

    let metadataHandler: (() => void) | null = null
    try {
      const decoded = JSON.parse(decodeURIComponent(resumeParam))
      const resumeBook: Book = {
        id: decoded.id ?? Date.now(),
        title: decoded.title ?? "Untitled",
        author: decoded.author ?? "Unknown Author",
        duration: decoded.duration ?? "",
        rating: decoded.rating ?? 4.7,
        cover: decoded.cover ?? "/placeholder.svg",
        category: decoded.category ?? "Library",
        audio: decoded.audio || "",
        language: decoded.language,
        description: decoded.description,
      }
      const rawResumeTime = Number(decoded.resumeTimeSeconds ?? decoded.resumeTime ?? 0)
      const resumeTime = Number.isFinite(rawResumeTime) ? Math.max(0, rawResumeTime) : 0
      setCurrentBook(resumeBook)

      const params = new URLSearchParams(searchParams.toString())
      params.delete("resume")
      router.replace(params.toString() ? `/browse?${params.toString()}` : "/browse", { scroll: false })

      const audioEl = audioRef.current
      if (!audioEl) return

      audioEl.pause()
      audioEl.src = resumeBook.audio || ""
      const setPosition = () => {
        const clamped = Math.max(0, Math.min(resumeTime, audioEl.duration || resumeTime))
        audioEl.currentTime = clamped
        setCurrentTime(clamped)
      }
      metadataHandler = setPosition
      audioEl.addEventListener("loadedmetadata", setPosition, { once: true })
      audioEl.load()

      audioEl
        .play()
        .then(() => {
          setIsPlaying(true)
          setResumeMessage(`Resumed "${resumeBook.title}" at ${formatTime(resumeTime)}`)
        })
        .catch(() => {
          setResumeMessage(`Ready to resume "${resumeBook.title}" at ${formatTime(resumeTime)} — press play to continue.`)
        })
    } catch (error) {
      console.error("Failed to resume playback", error)
    }

    return () => {
      if (metadataHandler && audioRef.current) {
        audioRef.current.removeEventListener("loadedmetadata", metadataHandler)
      }
    }
  }, [searchParams, router])

  const attemptPlayback = async (source: string) => {
    if (!audioRef.current || !source || source.trim() === "") return false
    
    // Prevent multiple simultaneous play attempts
    if (isPlayingRef.current) {
      return false
    }
    
    try {
      // Pause any currently playing audio first
      if (!audioRef.current.paused) {
        audioRef.current.pause()
      }
      
      isPlayingRef.current = true
      audioRef.current.src = source
      audioRef.current.currentTime = 0
      audioRef.current.load()
      
      // Wait for audio to be ready
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          audioRef.current?.removeEventListener("canplay", onCanPlay)
          audioRef.current?.removeEventListener("error", onError)
          reject(new Error("Audio load timeout"))
        }, 5000)
        
        const onCanPlay = () => {
          clearTimeout(timeout)
          audioRef.current?.removeEventListener("canplay", onCanPlay)
          audioRef.current?.removeEventListener("error", onError)
          resolve()
        }
        
        const onError = () => {
          clearTimeout(timeout)
          audioRef.current?.removeEventListener("canplay", onCanPlay)
          audioRef.current?.removeEventListener("error", onError)
          reject(new Error("Audio load error"))
        }
        
        if (audioRef.current && audioRef.current.readyState >= 2) {
          clearTimeout(timeout)
          resolve()
        } else {
          audioRef.current?.addEventListener("canplay", onCanPlay, { once: true })
          audioRef.current?.addEventListener("error", onError, { once: true })
        }
      })
      
      // Now play the audio
      const playPromise = audioRef.current.play()
      
      if (playPromise !== undefined) {
        await playPromise
      }
      
      setIsPlaying(true)
      isPlayingRef.current = false
      return true
    } catch (error: any) {
      isPlayingRef.current = false
      // Ignore "The play() request was interrupted" errors
      if (error?.name === "AbortError" || error?.name === "NotAllowedError") {
        return false
      }
      console.warn("Failed to play source", source, error)
      setIsPlaying(false)
      return false
    }
  }

  const handlePlay = async (book: Book) => {
    if (!book.audio || !audioRef.current) return

    const isSameBook = currentBook?.id === book.id

    if (isSameBook) {
      if (isPlaying) {
        try {
          audioRef.current.pause()
          setIsPlaying(false)
          isPlayingRef.current = false
        } catch (error) {
          console.warn("Error pausing audio:", error)
        }
        return
      }

      try {
        // Ensure audio is loaded
        if (audioRef.current.readyState < 2) {
          audioRef.current.load()
          await new Promise<void>((resolve) => {
            const onCanPlay = () => {
              audioRef.current?.removeEventListener("canplay", onCanPlay)
              resolve()
            }
            if (audioRef.current && audioRef.current.readyState >= 2) {
              resolve()
            } else {
              audioRef.current?.addEventListener("canplay", onCanPlay, { once: true })
            }
          })
        }
        
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          await playPromise
        }
        setIsPlaying(true)
        return
      } catch (error: any) {
        // Ignore interruption errors
        if (error?.name === "AbortError" || error?.name === "NotAllowedError") {
          return
        }
        if (book.audio && book.audio.trim() !== "") {
          await attemptPlayback(book.audio)
        }
        return
      }
    }

    setCurrentBook(book)
    if (book.audio && book.audio.trim() !== "") {
      await attemptPlayback(book.audio)
    }
  }

  useEffect(() => {
    const bookIdParam = searchParams.get("bookId")
    if (!bookIdParam) return

    const parsedId = Number(bookIdParam)
    if (!Number.isFinite(parsedId)) return

    const targetBook = allAudioContent.find((book) => book.id === parsedId)
    if (!targetBook) return

    if (targetBook.category) {
      setSelectedCategory(targetBook.category)
    }

    setCurrentBook(targetBook)
    setIsPlaying(false)
    setCurrentTime(0)

    const params = new URLSearchParams(searchParams.toString())
    params.delete("bookId")
    const nextUrl = params.toString() ? `/browse?${params.toString()}` : "/browse"
    router.replace(nextUrl, { scroll: false })

    if (audioRef.current && targetBook.audio && targetBook.audio.trim() !== "") {
      audioRef.current.src = targetBook.audio
      audioRef.current.currentTime = 0
      audioRef.current.load()
    }
  }, [searchParams])

  // Fetch accurate durations from audio files
  useEffect(() => {
    const fetchDurations = async () => {
      const durationPromises = allAudioContent.map((book) => {
        return new Promise<{ id: number; duration: number }>((resolve) => {
          if (!book.audio || book.audio.trim() === "") {
            resolve({ id: book.id, duration: book.durationSeconds || 0 })
            return
          }

          const audio = new Audio()
          audio.preload = "metadata"
          
          const handleLoadedMetadata = () => {
            if (Number.isFinite(audio.duration) && audio.duration > 0) {
              resolve({ id: book.id, duration: Math.floor(audio.duration) })
            } else {
              resolve({ id: book.id, duration: book.durationSeconds || 0 })
            }
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
            audio.removeEventListener("error", handleError)
          }

          const handleError = () => {
            resolve({ id: book.id, duration: book.durationSeconds || 0 })
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
            audio.removeEventListener("error", handleError)
          }

          audio.addEventListener("loadedmetadata", handleLoadedMetadata)
          audio.addEventListener("error", handleError)
          audio.src = book.audio
        })
      })

      const durations = await Promise.all(durationPromises)
      const durationMap = new Map<number, number>()
      durations.forEach(({ id, duration }) => {
        if (duration > 0) {
          durationMap.set(id, duration)
        }
      })
      setBookDurations(durationMap)
    }

    fetchDurations()
  }, [])

  // Keep duration/currentTime in sync with real player state
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => {
      if (!Number.isFinite(audio.currentTime) || audio.currentTime < 0) return
      setCurrentTime(audio.currentTime)
    }

    const setAudioDuration = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration)
        // Update book duration in state if current book
        if (currentBook) {
          setBookDurations((prev) => {
            const newMap = new Map(prev)
            newMap.set(currentBook.id, Math.floor(audio.duration))
            return newMap
          })
        }
      }
    }

    const tick = () => {
      if (!audio.paused && !audio.ended) {
        updateTime()
        rafRef.current = requestAnimationFrame(tick)
      } else if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }

    const handlePlay = () => {
      updateTime()
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    const stopTicking = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      updateTime()
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", setAudioDuration)
    audio.addEventListener("durationchange", setAudioDuration)
    audio.addEventListener("seeked", updateTime)
    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", stopTicking)
    audio.addEventListener("ended", stopTicking)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", setAudioDuration)
      audio.removeEventListener("durationchange", setAudioDuration)
      audio.removeEventListener("seeked", updateTime)
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", stopTicking)
      audio.removeEventListener("ended", stopTicking)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [currentBook])

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(e.target.value)
      setCurrentTime(Number(e.target.value))
    }
  }

  const activeDuration = (() => {
    if (duration && Number.isFinite(duration) && duration > 0) return duration
    if (currentBook) {
      const accurateDuration = bookDurations.get(currentBook.id)
      if (accurateDuration && accurateDuration > 0) return accurateDuration
      if (currentBook.durationSeconds && currentBook.durationSeconds > 0) return currentBook.durationSeconds
      return Math.max(parseDurationToSeconds(currentBook.duration), 1)
    }
    return 1
  })()

  const clampedCurrentTime = Math.min(Math.max(currentTime || 0, 0), activeDuration)

  // Filter books by category and search query
  const filteredBooks = allAudioContent.filter((book) => {
    const query = searchQuery.toLowerCase().trim()
    const hasSearchQuery = query !== ""
    
    // Check if search query exactly matches or contains a category name
    // Prioritize exact matches first
    const exactMatchCategory = hasSearchQuery ? categories.find(
      cat => cat.toLowerCase() === query
    ) : null
    
    const partialMatchCategory = hasSearchQuery && !exactMatchCategory ? categories.find(
      cat => cat.toLowerCase().includes(query) || query.includes(cat.toLowerCase())
    ) : null
    
    const matchedCategory = exactMatchCategory || partialMatchCategory
    const searchMatchesCategory = !!matchedCategory
    
    // Category filter - if search matches a category, use that category; otherwise use selected
    let categoryToMatch = selectedCategory
    if (searchMatchesCategory && hasSearchQuery && matchedCategory) {
      categoryToMatch = matchedCategory
    }
    
    const matchesCategory =
      categoryToMatch === "All" ||
      book.category?.toLowerCase() === categoryToMatch.toLowerCase() ||
      book.language?.toLowerCase() === categoryToMatch.toLowerCase()
    
    // Search filter (searches in title, author, description, category, and language)
    const matchesSearch = !hasSearchQuery || (() => {
      const title = book.title?.toLowerCase() || ""
      const author = book.author?.toLowerCase() || ""
      const description = book.description?.toLowerCase() || ""
      const category = book.category?.toLowerCase() || ""
      const language = book.language?.toLowerCase() || ""
      
      // If search exactly matches a category name, show all books in that category
      if (exactMatchCategory) {
        return category === exactMatchCategory.toLowerCase()
      }
      
      // If search partially matches a category, show books in that category OR matching search
      if (partialMatchCategory) {
        return category === partialMatchCategory.toLowerCase() || 
               title.includes(query) || 
               author.includes(query) || 
               description.includes(query) ||
               language.includes(query)
      }
      
      // Otherwise, search in all fields including category
      return (
        title.includes(query) || 
        author.includes(query) || 
        description.includes(query) ||
        category.includes(query) ||
        language.includes(query)
      )
    })()
    
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E1E2F] via-[#2A2A3E] to-[#1E1E2F]">
      <Header />

      <main className="pt-20 sm:pt-24 pb-24 sm:pb-32">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Page Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EAEAEA] mb-3 sm:mb-4">
              Browse <span className="text-[#FFD369]">Audio Verses</span>
            </h1>
            <p className="text-[#EAEAEA]/80 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
              Discover thousands of audio verses across all genres and languages, narrated by professional voice actors
            </p>
          </div>

          {/* Search & Filters */}
          <div className="bg-[#3A3A55]/30 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center w-full">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-[#EAEAEA]/60 h-4 w-4 sm:h-5 sm:w-5 z-10" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      const params = new URLSearchParams(searchParams.toString())
                      if (searchQuery.trim()) {
                        params.set("search", searchQuery.trim())
                      } else {
                        params.delete("search")
                      }
                      router.push(params.toString() ? `/browse?${params.toString()}` : "/browse")
                    }
                  }}
                  placeholder="Search for books, authors, or narrators..."
                  className="pl-8 sm:pl-10 pr-8 sm:pr-10 text-sm sm:text-base bg-[#1E1E2F]/50 border-[#3A3A55] text-[#EAEAEA] placeholder:text-[#EAEAEA]/60 focus:border-[#FFD369] focus:ring-[#FFD369]/20 h-10 sm:h-11"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("")
                      const params = new URLSearchParams(searchParams.toString())
                      params.delete("search")
                      router.push(params.toString() ? `/browse?${params.toString()}` : "/browse")
                    }}
                    className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-[#EAEAEA]/60 hover:text-[#FFD369] transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {resumeMessage && (
            <div className="mb-6 sm:mb-8 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#3A3A55]/40 border border-[#FFD369]/30 text-[#EAEAEA] text-xs sm:text-sm">
              {resumeMessage}
            </div>
          )}

          {/* Language Categories */}
          <div id="language-categories" className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#EAEAEA] mb-3 sm:mb-4 flex items-center gap-2">
              <Languages className="h-5 w-5 sm:h-6 sm:w-6 text-[#FFD369]" />
              Language Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-[#3A3A55]/30 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-[#3A3A55]/50 transition-all duration-300 cursor-pointer" onClick={() => { setSelectedCategory("French"); router.push("/browse?category=French") }}>
                <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-[#EAEAEA]">French Audio</h3>
                  <div className="bg-[#FFD369] text-[#1E1E2F] px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">{frenchAudio.length} titles</div>
                </div>
                <p className="text-[#EAEAEA]/70 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">Discover French literature and culture through our curated collection of French audio verses</p>
                <div className="flex items-center text-[#EAEAEA]/60 text-xs sm:text-sm flex-wrap">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">Total: {frenchAudio.reduce((acc, audio) => acc + parseDurationToHours(audio.durationSeconds ?? audio.duration), 0).toFixed(1)}h of content</span>
                </div>
              </div>
              <div className="bg-[#3A3A55]/30 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-[#3A3A55]/50 transition-all duration-300 cursor-pointer" onClick={() => { setSelectedCategory("Arabic"); router.push("/browse?category=Arabic") }}>
                <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-[#EAEAEA]">Arabic Audio</h3>
                  <div className="bg-[#FFD369] text-[#1E1E2F] px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">{arabicAudio.length} titles</div>
                </div>
                <p className="text-[#EAEAEA]/70 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">Explore Arabic literature, poetry, and cultural heritage through our Arabic audio verse collection</p>
                <div className="flex items-center text-[#EAEAEA]/60 text-xs sm:text-sm flex-wrap">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">Total: {arabicAudio.reduce((acc, audio) => acc + parseDurationToHours(audio.durationSeconds ?? audio.duration), 0).toFixed(1)}h of content</span>
                </div>
              </div>
              <PortugueseSection onClick={() => { setSelectedCategory("Portuguese"); router.push("/browse?category=Portuguese") }} />
              <PolishSection onClick={() => { setSelectedCategory("Polish"); router.push("/browse?category=Polish") }} />
              <CzechSection onClick={() => { setSelectedCategory("Czech"); router.push("/browse?category=Czech") }} />
            </div>

            <div className="text-center mt-4 sm:mt-6">
              <Button
                onClick={() => router.push("/?section=voices")}
                className="bg-[#FFD369] text-[#1E1E2F] hover:bg-[#FFD369]/90 hover:scale-105 transition-all duration-300 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
              >
                Explore All Voice Options
              </Button>
            </div>
          </div>

          {/* All Categories */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#EAEAEA] mb-3 sm:mb-4">All Categories</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isSelected = selectedCategory.toLowerCase() === category.toLowerCase()
                return (
                <Button
                  key={category}
                    variant={isSelected ? "default" : "outline"}
                    className={`transition-all duration-300 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 ${
                      isSelected
                        ? "bg-[#FFD369] text-[#1E1E2F] border-[#FFD369] hover:bg-[#FFD369]/90 shadow-lg shadow-[#FFD369]/20"
                        : "border-[#3A3A55] text-[#EAEAEA] bg-transparent hover:bg-[#FFD369] hover:text-[#1E1E2F] hover:border-[#FFD369]"
                    }`}
                    onClick={() => {
                      setSelectedCategory(category)
                      const params = new URLSearchParams(searchParams.toString())
                      if (category === "All") {
                        params.delete("category")
                      } else {
                        params.set("category", category)
                      }
                      router.push(`/browse?${params.toString()}`)
                    }}
                >
                  {category}
                </Button>
                )
              })}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 sm:mb-6">
            <p className="text-[#EAEAEA]/70 text-xs sm:text-sm">
              {searchQuery.trim() ? (
                filteredBooks.length > 0 ? (
                  selectedCategory === "All" ? (
                    `Found ${filteredBooks.length} ${filteredBooks.length === 1 ? 'book' : 'books'} matching "${searchQuery}"`
                  ) : (
                    `Found ${filteredBooks.length} ${filteredBooks.length === 1 ? 'book' : 'books'} matching "${searchQuery}" in "${selectedCategory}"`
                  )
                ) : (
                  selectedCategory === "All" ? (
                    `No books found matching "${searchQuery}"`
                  ) : (
                    `No books found matching "${searchQuery}" in "${selectedCategory}"`
                  )
                )
              ) : (
                selectedCategory === "All" 
                  ? `Showing all ${filteredBooks.length} books`
                  : filteredBooks.length > 0
                    ? `Showing ${filteredBooks.length} ${filteredBooks.length === 1 ? 'book' : 'books'} in "${selectedCategory}"`
                    : `No books found in "${selectedCategory}"`
              )}
            </p>
          </div>

          {/* Books Grid */}
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {filteredBooks.map((book, index) => (
              <div key={`${book.id}-${book.title}-${index}`} className="bg-[#3A3A55]/30 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-4 hover:bg-[#3A3A55]/50 transition-all duration-300 hover:scale-105 group flex flex-col h-full">
                <div className="relative mb-2 sm:mb-4 w-full aspect-[3/4] flex-shrink-0 overflow-hidden rounded-lg">
                  <img src={book.cover || "/placeholder.svg"} alt={book.title} className="w-full h-full object-cover rounded-lg" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                    <Button onClick={() => handlePlay(book)} className="bg-[#FFD369] text-[#1E1E2F] hover:bg-[#FFD369]/90 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2">
                      {currentBook?.id === book.id && isPlaying ? (
                        <><Pause className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Pause</span></>
                      ) : (
                        <><Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Play</span></>
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col flex-1 min-h-0">
                  {/* Language Badge */}
                  {book.language && (
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                      <span className="bg-[#FFD369] text-[#1E1E2F] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium">
                        {book.language}
                      </span>
                    </div>
                  )}
                  
                  <h3 className="text-[#EAEAEA] font-semibold mb-1 text-xs sm:text-sm line-clamp-2 flex-shrink-0">{book.title}</h3>
                  <p className="text-[#EAEAEA]/70 text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-1 flex-shrink-0">{book.author}</p>
                  
                  {/* Description for language content */}
                  {book.description && (
                    <p className="text-[#EAEAEA]/60 text-xs mb-1 sm:mb-2 line-clamp-2 flex-1 min-h-0">{book.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs sm:text-sm mt-auto flex-shrink-0">
                    <div className="flex items-center text-[#EAEAEA]/60 min-w-0">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">
                        {(() => {
                          const accurateDuration = bookDurations.get(book.id)
                          if (accurateDuration && accurateDuration > 0) {
                            return formatHHMMSS(accurateDuration)
                          }
                          if (book.durationSeconds && book.durationSeconds > 0) {
                            return formatHHMMSS(book.durationSeconds)
                          }
                          return book.duration
                        })()}
                      </span>
                    </div>
                    <div className="flex items-center text-[#FFD369] flex-shrink-0 ml-1">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1 fill-current" /> 
                      <span className="text-xs sm:text-sm">{book.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <p className="text-[#EAEAEA]/60 text-sm sm:text-base md:text-lg mb-4 px-2">
                {searchQuery.trim() 
                  ? `No books found${selectedCategory !== "All" ? ` in "${selectedCategory}"` : ""} matching "${searchQuery}"`
                  : `No books found in "${selectedCategory}"`
                }
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                {searchQuery.trim() && (
                  <Button
                    onClick={() => setSearchQuery("")}
                    className="bg-[#FFD369] text-[#1E1E2F] hover:bg-[#FFD369]/90 text-xs sm:text-sm px-3 sm:px-4 py-2"
                  >
                    Clear Search
                  </Button>
                )}
                {selectedCategory !== "All" && (
                  <Button
                    onClick={() => {
                      setSelectedCategory("All")
                      router.push("/browse")
                    }}
                    className="bg-[#3A3A55] text-[#EAEAEA] hover:bg-[#3A3A55]/80 border border-[#3A3A55] text-xs sm:text-sm px-3 sm:px-4 py-2"
                  >
                    View All Categories
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Audio Player Controls */}
      {currentBook && (
        <div className="fixed bottom-0 left-0 w-full bg-[#3A3A55]/95 backdrop-blur-md p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 z-50 border-t border-[#3A3A55]">
          <div className="flex items-center gap-2 sm:gap-4 w-full md:w-auto min-w-0">
            <img src={currentBook.cover} alt={currentBook.title} className="w-12 h-14 sm:w-16 sm:h-20 object-cover rounded-lg flex-shrink-0" />
            <div className="text-[#EAEAEA] min-w-0 flex-1">
              <p className="font-semibold text-xs sm:text-sm md:text-base truncate">{currentBook.title}</p>
              <p className="text-xs sm:text-sm text-[#EAEAEA]/70 truncate">{currentBook.author}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button onClick={async () => {
              if (!audioRef.current) return
              
              if (isPlaying) {
                try {
                  audioRef.current.pause()
                  setIsPlaying(false)
                  isPlayingRef.current = false
                } catch (error) {
                  console.warn("Error pausing audio:", error)
                }
              } else {
                try {
                  if (audioRef.current.readyState < 2) {
                    audioRef.current.load()
                    await new Promise<void>((resolve) => {
                      const onCanPlay = () => {
                        audioRef.current?.removeEventListener("canplay", onCanPlay)
                        resolve()
                      }
                      if (audioRef.current && audioRef.current.readyState >= 2) {
                        resolve()
                      } else {
                        audioRef.current?.addEventListener("canplay", onCanPlay, { once: true })
                      }
                    })
                  }
                  
                  const playPromise = audioRef.current.play()
                  if (playPromise !== undefined) {
                    await playPromise
                  }
                  setIsPlaying(true)
                } catch (error: any) {
                  // Ignore interruption errors
                  if (error?.name !== "AbortError" && error?.name !== "NotAllowedError") {
                    console.warn("Error playing audio:", error)
                  }
                }
              }
            }} className="bg-[#FFD369] text-[#1E1E2F] hover:bg-[#FFD369]/90 h-8 w-8 sm:h-10 sm:w-10 p-0 flex-shrink-0">
              {isPlaying ? <Pause className="h-3 w-3 sm:h-4 sm:w-4" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4" />}
            </Button>
            <input
              type="range"
              min={0}
              max={activeDuration}
              value={clampedCurrentTime}
              onChange={handleSeek}
              className="flex-1 md:w-64"
            />
            <span className="text-[#EAEAEA]/70 text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
              {formatHHMMSS(clampedCurrentTime)} / {formatHHMMSS(activeDuration)}
            </span>
          </div>
        </div>
      )}

      <audio 
        ref={audioRef} 
        onEnded={() => {
          setIsPlaying(false)
          isPlayingRef.current = false
        }}
        onPause={() => {
          isPlayingRef.current = false
        }}
        onPlay={() => {
          isPlayingRef.current = true
        }}
      />

      <Footer />
    </div>
  )
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#1E1E2F] via-[#2A2A3E] to-[#1E1E2F] flex items-center justify-center">
        <Header />
        <div className="text-[#EAEAEA] text-lg">Loading...</div>
        <Footer />
      </div>
    }>
      <BrowsePageContent />
    </Suspense>
  )
}
