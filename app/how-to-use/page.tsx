import Navigation from "@/components/Navigation";

export default function HowToUse() {
  return (
    <div className="min-h-screen bg-navy-900 text-white">
      <main className="flex flex-col gap-[64px] items-center p-8 min-h-screen">
        <Navigation />

        <div className="flex flex-col gap-[32px] items-start w-full max-w-3xl">
          <h1 className="text-[48px] font-bold text-white font-source-code leading-normal">
            How to Use
          </h1>

          <div className="space-y-8 font-source-sans text-[16px] text-white/80">
            <section className="space-y-4">
              <h2 className="text-[24px] font-bold text-white font-source-code">
                Getting Started
              </h2>
              <p>
                The AI-Enhanced Design Workflow is organized into 5 key phases that guide you
                through the design process from discovery to delivery.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-[24px] font-bold text-white font-source-code">
                Navigating the Workflow
              </h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>Click on any phase card to expand and view available tools</li>
                <li>Each phase contains multiple substeps with relevant tools</li>
                <li>Click on a tool to view detailed information in the side panel</li>
                <li>Use the tools in sequence or jump to specific phases as needed</li>
              </ol>
            </section>

            <section className="space-y-4">
              <h2 className="text-[24px] font-bold text-white font-source-code">
                The 5 Phases
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="text-orange-500 font-bold">1. Discovery:</span> Research and
                  understand user needs
                </div>
                <div>
                  <span className="text-orange-500 font-bold">2. Define:</span> Synthesize insights
                  and define problems
                </div>
                <div>
                  <span className="text-orange-500 font-bold">3. Ideate:</span> Generate creative
                  solutions
                </div>
                <div>
                  <span className="text-orange-500 font-bold">4. Prototype:</span> Build and test
                  concepts
                </div>
                <div>
                  <span className="text-orange-500 font-bold">5. Deliver:</span> Finalize and hand
                  off designs
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-[24px] font-bold text-white font-source-code">
                Contributing
              </h2>
              <p>
                Help us expand this workflow by{" "}
                <a href="/submit" className="text-orange-500 underline hover:text-orange-400">
                  submitting tools
                </a>{" "}
                you&apos;ve found useful in your design process. All submissions are reviewed before
                being added to the workflow.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
