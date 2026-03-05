"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Mic, Zap, Smartphone, Users, Shield, Headphones } from "lucide-react"

const features = [
  {
    icon: Mic,
    title: "100+ AI Voices",
    description:
      "Choose from a diverse range of AI-generated voices, each with unique personalities and accents to match any story.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Zap,
    title: "Instant Access",
    description:
      "Start listening immediately with our advanced streaming technology. No downloads required, just pure listening pleasure.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Smartphone,
    title: "Cross-Platform",
    description:
      "Seamlessly sync your progress across all devices. Start on your phone, continue on your tablet, finish on your computer.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "Join millions of audiobook lovers. Share reviews, create playlists, and discover new favorites through our community.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Shield,
    title: "Premium Quality",
    description:
      "Every audiobook is professionally mastered with crystal-clear audio quality and noise-free listening experience.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Headphones,
    title: "Smart Features",
    description:
      "Sleep timer, speed control, bookmarks, and offline listening. Everything you need for the perfect audiobook experience.",
    color: "from-teal-500 to-blue-500",
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#1E1E2F] to-[#3A3A55]/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#EAEAEA] mb-4">Why Choose Audio Verses?</h2>
          <p className="text-[#EAEAEA]/70 text-lg max-w-3xl mx-auto">
            Experience the future of audio verses with cutting-edge AI technology, premium quality, and features designed
            for the modern listener.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <Card
                key={index}
                className="bg-gradient-to-br from-[#3A3A55]/50 to-[#1E1E2F]/50 border-[#3A3A55] backdrop-blur-sm hover:scale-105 hover:shadow-lg hover:shadow-[#FFD369]/10 transition-all duration-500 group"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-[#EAEAEA] mb-4 group-hover:text-[#FFD369] transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-[#EAEAEA]/70 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
