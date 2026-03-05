import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-[#1E1E2F] border-t border-[#3A3A55]">
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-4 max-w-xl">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.jpg"
              alt="Audio Verses Logo"
              width={32}
              height={32}
              className="rounded-md"
            />
            <span className="text-lg font-semibold text-[#EAEAEA]">Audio Verses</span>
          </Link>
          <p className="text-[#EAEAEA]/70 text-sm leading-relaxed">
            Transform your reading experience with AI-powered audio verses. Premium quality, unlimited access, and voices that bring stories to life.
          </p>
        </div>
      </div>
    </footer>
  )
}
