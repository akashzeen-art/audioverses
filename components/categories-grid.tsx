"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Zap, Heart, Briefcase, Sparkles, Globe, Search, User, Award, BookMarked, Baby } from "lucide-react"
import categoryMapping from "@/lib/category-mapping.json"

const categoryConfig = [
  {
    name: "Fiction",
    icon: BookOpen,
    count: "12,500+",
    color: "from-purple-500 to-pink-500",
    description: "Immerse yourself in captivating stories",
  },
  {
    name: "Non-Fiction",
    icon: BookMarked,
    count: "5,200+",
    color: "from-blue-500 to-indigo-500",
    description: "Discover real stories and facts",
  },
  {
    name: "Mystery",
    icon: Search,
    count: "3,900+",
    color: "from-gray-700 to-gray-900",
    description: "Unravel thrilling mysteries",
  },
  {
    name: "Romance",
    icon: Heart,
    count: "6,800+",
    color: "from-red-500 to-pink-500",
    description: "Fall in love with beautiful stories",
  },
  {
    name: "Sci-Fi",
    icon: Sparkles,
    count: "4,300+",
    color: "from-cyan-500 to-blue-500",
    description: "Journey to the future and beyond",
  },
  {
    name: "Biography",
    icon: User,
    count: "2,700+",
    color: "from-amber-500 to-orange-500",
    description: "Learn from extraordinary lives",
  },
  {
    name: "Self-Help",
    icon: Zap,
    count: "8,200+",
    color: "from-yellow-500 to-orange-500",
    description: "Transform your life with expert guidance",
  },
  {
    name: "Business",
    icon: Briefcase,
    count: "4,500+",
    color: "from-green-500 to-emerald-500",
    description: "Grow your career and business",
  },
  {
    name: "History",
    icon: Globe,
    count: "3,700+",
    color: "from-orange-500 to-red-500",
    description: "Discover the past through stories",
  },
  {
    name: "Fantasy",
    icon: Sparkles,
    count: "9,100+",
    color: "from-purple-500 to-indigo-500",
    description: "Escape to magical worlds",
  },
  {
    name: "Thriller",
    icon: Award,
    count: "5,600+",
    color: "from-red-600 to-red-900",
    description: "Edge-of-your-seat excitement",
  },
  {
    name: "Children",
    icon: Baby,
    count: "6,400+",
    color: "from-yellow-400 to-pink-400",
    description: "Stories for young minds",
  },
]

export function CategoriesGrid() {
  const [images, setImages] = useState<Record<string, string>>({})

  useEffect(() => {
    // Load images from category mapping
    const imageMap: Record<string, string> = {}
    categoryConfig.forEach((config) => {
      const categoryData = categoryMapping[config.name as keyof typeof categoryMapping]
      if (categoryData?.sample_image) {
        imageMap[config.name] = categoryData.sample_image
      }
    })
    setImages(imageMap)
  }, [])

  return (
    <section className="py-20 bg-gradient-to-b from-[#3A3A55]/20 to-[#1E1E2F]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#EAEAEA] mb-4">Explore Categories</h2>
          <p className="text-[#EAEAEA]/70 text-lg max-w-2xl mx-auto">
            Discover audio verses across all genres with AI voices that match the mood
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {categoryConfig.map((category) => {
            const IconComponent = category.icon
            const categoryImage = images[category.name]
            return (
              <Link
                key={category.name}
                href={`/browse?category=${encodeURIComponent(category.name)}`}
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD369]/60 rounded-2xl"
                aria-label={`Browse ${category.name} audiobooks`}
              >
                <Card className="bg-gradient-to-br from-[#3A3A55]/50 to-[#1E1E2F]/50 border-[#3A3A55] backdrop-blur-sm hover:scale-105 hover:shadow-lg hover:shadow-[#FFD369]/10 transition-all duration-500 cursor-pointer group overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative">
                      {/* Category Image */}
                      {categoryImage && (
                        <div className="relative w-full h-48 overflow-hidden">
                          <Image
                            src={categoryImage}
                            alt={category.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                            onError={(e) => {
                              // Hide image on error
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        </div>
                      )}
                      {/* Content Overlay */}
                      <div className={`absolute inset-0 ${categoryImage ? 'bg-gradient-to-t from-black/90 via-transparent to-transparent' : 'bg-gradient-to-br from-[#3A3A55]/80 to-[#1E1E2F]/80'} p-6 flex flex-col justify-end`}>
                        <div className="flex items-start space-x-4">
                          <div
                            className={`p-3 rounded-xl bg-gradient-to-br ${category.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                          >
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white group-hover:text-[#FFD369] transition-colors duration-300">
                              {category.name}
                            </h3>
                            <p className="text-white/80 text-sm mt-1">{category.description}</p>
                            <p className="text-[#FFD369] font-medium mt-2">{category.count} books</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
