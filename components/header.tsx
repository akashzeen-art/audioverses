"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Menu, X, Search, Languages } from "lucide-react"
import GoogleTranslate from "./GoogleTranslate"

export function Header() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      inputRef.current?.focus()
    }

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isSearchOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearchOpen(false)
      router.push(`/browse?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const iframe = document.querySelector("iframe.skiptranslate") as HTMLElement
      if (iframe) iframe.style.display = "none"

      const banner = document.querySelector(".goog-te-banner-frame") as HTMLElement
      if (banner) banner.style.display = "none"

      document.body.style.top = "0px"
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#1E1E2F]/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto px-4 py-4 container">
        <div className="flex justify-between items-center gap-3">
          {/* Logo */}
          <Link href="/" className="group flex items-center space-x-2">
            <div className="relative w-39 h-15">
              <Image
                src="/logo.jpg"
                alt="Audio Verses Logo"
                fill
                className="rounded object-contain"
              />
            </div>
            {/* <span className="font-semibold text-[#EAEAEA] group-hover:text-[#FFD369] text-lg transition-colors duration-300">
              Audio Verses
            </span> */}
          </Link>

          <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            {["Home", "Browse"].map((item) => (
              <Link
                key={item}
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className={cn(
                  "group relative text-[#EAEAEA] hover:text-[#FFD369] transition-all duration-300 px-3 py-1 rounded-full"
                )}
              >
                {item}
                <span className="-bottom-1 left-0 absolute bg-[#FFD369] w-0 group-hover:w-full h-0.5 transition-all duration-300" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-[#EAEAEA] hover:text-[#FFD369] order-1"
              onClick={() => router.push("/browse")}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Language Selector */}
            <div className="flex items-center gap-2 order-2 md:order-1 md:border-l md:border-[#3A3A55]/40 md:pl-4">
              <Languages className="w-4 h-4 text-[#EAEAEA]/70 hidden md:block" />
              <GoogleTranslate />
            </div>

            {/* Desktop Actions */}
            <div
              className="hidden relative md:flex items-center order-2"
              ref={searchRef}
            >
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-[#3A3A55]/50 text-[#EAEAEA] hover:text-[#FFD369]"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* Search Dropdown */}
              {isSearchOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-[#3A3A55]/95 backdrop-blur-md rounded-lg shadow-xl border border-[#3A3A55] z-[9999]">
                  <form onSubmit={handleSearch} className="p-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#EAEAEA]/60 h-4 w-4" />
                      <Input
                        ref={inputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search books, authors..."
                        className="pl-10 bg-[#1E1E2F]/50 border-[#3A3A55] text-[#EAEAEA] placeholder:text-[#EAEAEA]/60 focus:border-[#FFD369]"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSearch(e)
                          }
                          if (e.key === "Escape") {
                            setIsSearchOpen(false)
                          }
                        }}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full mt-3 bg-[#FFD369] text-[#1E1E2F] hover:bg-[#FFD369]/90"
                    >
                      Search
                    </Button>
                  </form>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-[#EAEAEA] hover:text-[#FFD369] order-3"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden transition-all duration-500 overflow-hidden rounded-2xl border border-[#3A3A55]/60 bg-[#0F0F1F]/95 backdrop-blur-xl shadow-2xl shadow-black/30",
            isMenuOpen ? "max-h-[28rem] opacity-100 mt-4 px-4 py-4" : "max-h-0 opacity-0 px-4"
          )}
        >
          <nav className="space-y-2">
            {["Home", "Browse"].map((item) => (
              <Link
                key={item}
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className={cn(
                  "block hover:bg-[#3A3A55]/40 px-4 py-3 rounded-xl text-[#EAEAEA] hover:text-[#FFD369] transition-all duration-300 border border-transparent hover:border-[#3A3A55]"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            ))}

          </nav>
        </div>

      </div>
    </header>
  )
}
