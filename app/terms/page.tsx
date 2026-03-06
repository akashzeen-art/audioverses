import { Header } from "@/components/header"
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#1E1E2F] text-[#EAEAEA] px-4 sm:px-6 box-border py-8 sm:py-12">
      <Header />
      <div className="max-w-4xl mx-auto mt-8 sm:mt-10 space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#FFD369]">Terms & Conditions</h1>
        <p className="text-sm sm:text-base text-[#EAEAEA]/80 leading-relaxed font-medium">
          By clicking on Subscribe, you agree to the below terms and conditions:
        </p>

        <ul className="space-y-4 sm:space-y-5 text-sm sm:text-base text-[#EAEAEA]/80 leading-relaxed list-none">
          <li className="flex gap-3">
            <span className="text-[#FFD369] mt-1 shrink-0">•</span>
            <span>You will start the paid subscription after the free period automatically.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#FFD369] mt-1 shrink-0">•</span>
            <span>No commitment—you can cancel your subscription at any time.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#FFD369] mt-1 shrink-0">•</span>
            <span>The free trial is valid only for new subscribers.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#FFD369] mt-1 shrink-0">•</span>
            <span>Enjoy your free trial for 24 hours.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#FFD369] mt-1 shrink-0">•</span>
            <span>Please make sure that your browser is not using any 3rd-party blocking technologies and you have a healthy internet connection for swift access to the content.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#FFD369] mt-1 shrink-0">•</span>
            <span>By proceeding, you are accepting all Terms and Conditions of the service and agree to receive updates about your subscription on your registered mobile number.</span>
          </li>
        </ul>

        <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-[#EAEAEA]/60">Last updated: March 2025</p>
      </div>
    </div>
  )
}
