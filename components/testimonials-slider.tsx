"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Book Enthusiast",
    avatar: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    text: "The AI voices are incredibly natural! I was skeptical at first, but now I prefer them to traditional narrators. The variety is amazing.",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Busy Professional",
    avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    text: "Perfect for my commute. The cross-platform sync means I never lose my place, and the voice quality is outstanding.",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Student",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    text: "As someone with dyslexia, audiobooks have changed my life. The AI voices make it even better - I can choose the perfect voice for each book.",
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Retiree",
    avatar: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    text: "I've been listening to audiobooks for 20 years. This platform offers the best selection and the most natural-sounding AI voices I've ever heard.",
  },
  {
    id: 5,
    name: "Lisa Park",
    role: "Teacher",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces&auto=format",
    rating: 5,
    text: "The educational content is fantastic, and being able to adjust the speed and choose different voices helps me learn better. Highly recommended!",
  },
]

export function TestimonialsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 bg-gradient-to-b from-[#3A3A55]/20 to-[#1E1E2F]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#EAEAEA] mb-4">What Our Users Say</h2>
          <p className="text-[#EAEAEA]/70 text-lg max-w-2xl mx-auto">
            Join thousands of satisfied listeners who have transformed their reading experience
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <Card className="bg-gradient-to-br from-[#3A3A55]/50 to-[#1E1E2F]/50 border-[#3A3A55] backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <Quote className="h-12 w-12 text-[#FFD369] mx-auto mb-6 opacity-50" />

                      <p className="text-[#EAEAEA] text-lg leading-relaxed mb-8 italic">"{testimonial.text}"</p>

                      <div className="flex items-center justify-center space-x-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-[#FFD369] fill-current" />
                        ))}
                      </div>

                      <div className="flex items-center justify-center space-x-4">
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <img
                            src={testimonial.avatar || "/placeholder.svg"}
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full border-2 border-[#FFD369]/30 object-cover"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg"
                            }}
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#EAEAEA]">{testimonial.name}</h4>
                          <p className="text-[#EAEAEA]/70 text-sm">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-[#FFD369] scale-125" : "bg-[#3A3A55] hover:bg-[#FFD369]/50"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
