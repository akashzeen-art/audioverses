"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { BookOpen, Star } from "lucide-react"
import { Header } from "@/components/header"

export default function ProfilePage() {
  const name = "John Doe"
  const email = "john@example.com"

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1E1E2F] via-[#23233A] to-[#1E1E2F] text-[#EAEAEA] pt-20 sm:pt-24 px-4 sm:px-6">
      <Header />
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-10 text-center py-6 sm:py-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#2C2C3E]/70 backdrop-blur-md rounded-2xl shadow-2xl p-4 sm:p-6 md:p-10 flex flex-col items-center gap-4 sm:gap-6"
        >
          <div className="relative w-24 h-24 sm:w-32 sm:h-32">
            <Image
              src="/profile.jpg"
              alt="Profile Picture"
              fill
              className="rounded-full object-cover border-4 border-[#FFD369] shadow-lg"
            />
            <span className="absolute -bottom-1 sm:-bottom-2 right-1 sm:right-2 bg-[#FFD369] text-black text-xs px-2 sm:px-3 py-1 rounded-full shadow">
              Premium
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{name}</h1>
            <p className="text-[#EAEAEA]/70 text-sm sm:text-base">{email}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full">
            {[
              { label: "Audiobooks Completed", value: "85", icon: BookOpen },
              { label: "Favorites", value: "42", icon: Star },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-[#23233A] rounded-xl p-4 sm:p-6 shadow-lg flex flex-col items-center gap-2"
              >
                <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-[#FFD369]" />
                <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                <p className="text-xs sm:text-sm text-[#EAEAEA]/70 text-center leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#2C2C3E]/70 backdrop-blur-md rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl"
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Recent Activity</h2>
          <ul className="space-y-3 sm:space-y-4">
            {[
              { text: "Completed 'Atomic Habits'", time: "2 hours ago" },
              { text: "Added 'Deep Work' to library", time: "1 day ago" },
              { text: "Followed author James Clear", time: "3 days ago" },
            ].map((activity, i) => (
              <li key={i} className="bg-[#1E1E2F]/60 rounded-xl p-3 sm:p-4 text-left">
                <p className="text-xs sm:text-sm">{activity.text}</p>
                <p className="text-xs text-[#EAEAEA]/60 mt-1">{activity.time}</p>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
