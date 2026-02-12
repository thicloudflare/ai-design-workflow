import Link from "next/link";
import Navigation from "@/components/Navigation";
import ThemeToggle from "@/components/ThemeToggle";

export default function SubmissionSuccess() {
  return (
    <div className="min-h-screen bg-kumo-base text-text-default">
      <main className="flex flex-col gap-16 items-center p-8 min-h-screen">
        <div className="w-full flex items-center justify-between max-w-2xl">
          <div className="flex-1" />
          <Navigation />
          <div className="flex-1 flex justify-end">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex flex-col gap-8 items-center w-full max-w-2xl flex-1 justify-center">
          <div className="text-center space-y-6">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-kumo-success/10 border-2 border-kumo-success">
              <svg
                className="w-10 h-10 text-kumo-success"
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
              <h1 className="text-4xl font-semibold text-text-default leading-normal">
                Thank You!
              </h1>
              <p className="text-xl text-text-subtle">
                Your tool submission has been received.
              </p>
            </div>

            {/* Details */}
            <div className="bg-kumo-elevated border border-kumo-line rounded-lg p-6 text-left space-y-3">
              <p className="text-base text-text-subtle">
                <strong className="text-text-default">What happens next?</strong>
              </p>
              <ul className="space-y-2 text-sm text-text-subtle">
                <li className="flex items-start gap-2">
                  <span className="text-kumo-brand-text mt-1">•</span>
                  <span>Your submission has been sent to our team for review</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-kumo-brand-text mt-1">•</span>
                  <span>We&apos;ll manually review and add approved tools to the workflow</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-kumo-brand-text mt-1">•</span>
                  <span>You&apos;ll see your tool on the site once it&apos;s been added</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-6">
              <Link
                href="/"
                className="bg-kumo-brand hover:bg-kumo-brand-hover active:opacity-90 text-white font-medium text-base px-6 py-3 rounded-lg transition-colors inline-block"
              >
                Back to Home
              </Link>
              <Link
                href="/submit"
                className="bg-kumo-tint hover:bg-kumo-interact active:bg-kumo-fill text-text-default font-medium text-base px-6 py-3 rounded-lg transition-colors inline-block border border-kumo-line"
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
