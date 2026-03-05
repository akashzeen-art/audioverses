import { Header } from "@/components/header"
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#1E1E2F] text-[#EAEAEA] px-4 sm:px-6 box-border py-8 sm:py-12">
      <Header />
      <div className="max-w-4xl mx-auto mt-8 sm:mt-10 space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#FFD369]">Terms & Conditions</h1>
        <p className="text-sm sm:text-base text-[#EAEAEA]/80 leading-relaxed">
          Welcome to Audio Verses. By accessing or using our platform, you agree to the following terms and conditions.
          Please read them carefully.
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold mt-4 sm:mt-6">1. Use of Service</h2>
        <p className="text-sm sm:text-base text-[#EAEAEA]/70 leading-relaxed">
          You agree to use our audiobooks only for personal, non-commercial purposes and in compliance with all
          applicable laws.
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold mt-4 sm:mt-6">2. Accounts</h2>
        <p className="text-sm sm:text-base text-[#EAEAEA]/70 leading-relaxed">
          You are responsible for maintaining the confidentiality of your account and password and for all activities
          under your account.
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold mt-4 sm:mt-6">3. Intellectual Property</h2>
        <p className="text-sm sm:text-base text-[#EAEAEA]/70 leading-relaxed">
          All audiobooks, voices, and platform content remain the property of Audio Verses and may not be reproduced or
          redistributed.
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold mt-4 sm:mt-6">4. Termination</h2>
        <p className="text-sm sm:text-base text-[#EAEAEA]/70 leading-relaxed">
          We reserve the right to suspend or terminate your account if you violate these terms.
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold mt-4 sm:mt-6">5. Changes to Terms</h2>
        <p className="text-sm sm:text-base text-[#EAEAEA]/70 leading-relaxed">
          We may update these terms at any time. Continued use of our service after changes means you accept the new
          terms.
        </p>

        <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-[#EAEAEA]/60">Last updated: August 2024</p>
      </div>
    </div>
  )
}
