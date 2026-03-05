import { HeroSection } from "@/components/hero-section"
import { FeaturedCarousel } from "@/components/featured-carousel"
import { SearchSection } from "@/components/search-section"
import { CategoriesGrid } from "@/components/categories-grid"
import { NewArrivals } from "@/components/new-arrivals"
import { WhyChooseUs } from "@/components/why-choose-us"
import { AIVoiceDemo } from "@/components/ai-voice-demo"
import { TestimonialsSlider } from "@/components/testimonials-slider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FloatingElements } from "@/components/floating-elements"
import { ParallaxSection } from "@/components/parallax-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#1E1E2F] text-[#EAEAEA] relative overflow-hidden">
      <FloatingElements />
      <Header />
      <main>
        <HeroSection />
        <ParallaxSection />
        <FeaturedCarousel />
        <SearchSection />
        <CategoriesGrid />
        <NewArrivals />
        <WhyChooseUs />
        <AIVoiceDemo />
        <TestimonialsSlider />
      </main>
      <Footer />
    </div>
  )
}
