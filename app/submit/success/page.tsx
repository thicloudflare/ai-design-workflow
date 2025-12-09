import Link from "next/link";
import Navigation from "@/components/Navigation";

export default function SubmissionSuccess() {
  return (
    <div className="min-h-screen bg-navy-900 text-white">
      <main className="flex flex-col gap-[64px] items-center p-8 min-h-screen">
        <Navigation />

        <div className="flex flex-col gap-[32px] items-center w-full max-w-2xl flex-1 justify-center">
          <div className="text-center space-y-6">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Success Message */}
            <div className="space-y-3">
              <h1 className="text-[48px] font-bold text-white font-source-code leading-normal">
                Thank You!
              </h1>
              <p className="text-[20px] text-white/80 font-source-sans">
                Your tool submission has been received.
              </p>
            </div>

            {/* Details */}
            <div className="bg-navy-800 border border-white/20 rounded-lg p-6 text-left space-y-3">
              <p className="font-source-sans text-[16px] text-white/80">
                <strong className="text-white">What happens next?</strong>
              </p>
              <ul className="space-y-2 font-source-sans text-[14px] text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Your submission has been sent to our team for review</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>We&apos;ll manually review and add approved tools to the workflow</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>You&apos;ll see your tool on the site once it&apos;s been added</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-6">
              <Link
                href="/"
                className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-source-code text-[16px] px-6 py-3 rounded transition-colors inline-block"
              >
                Back to Home
              </Link>
              <Link
                href="/submit"
                className="bg-white/10 hover:bg-white/20 active:bg-white/5 text-white font-source-code text-[16px] px-6 py-3 rounded transition-colors inline-block border border-white/20"
              >
                Submit Another Tool
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
