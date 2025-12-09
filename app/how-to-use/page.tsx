import Navigation from "@/components/Navigation";
import { 
  MousePointerClick, 
  Wrench, 
  Zap, 
  Copy,
  Github,
  GitBranch,
  GitPullRequest,
  FileText,
  AlertTriangle,
  Scale,
  ShieldAlert
} from "lucide-react";

export default function HowToUse() {
  return (
    <div className="min-h-screen bg-navy-900 text-white">
      <main className="flex flex-col gap-[64px] items-center p-8 min-h-screen pb-20">
        <Navigation />

        <div className="flex flex-col gap-[48px] items-start w-full max-w-4xl">
          {/* How to Use This Resource */}
          <section className="w-full space-y-6">
            <h1 className="text-[48px] font-bold text-white font-source-code leading-normal">
              How to Use This Resource
            </h1>

            <div className="space-y-6 font-source-sans text-[16px] text-white/80">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <MousePointerClick className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-white mb-2">Select a Phase</h3>
                  <p>
                    Click any of the six major phases (Discovery, Ideation, etc.) to reveal the
                    detailed sub-steps.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-white mb-2">View the Toolkit</h3>
                  <p>
                    Each sub-step lists a specific AI Tool or Method and how it assists with that
                    design activity.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-white mb-2">Implement & Learn</h3>
                  <p>
                    Use these suggestions as a practical toolkit to integrate AI capabilities into
                    your own projects for accelerated, data-driven design.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Copy className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-white mb-2">Replicate</h3>
                  <p>
                    This guide is built in Windsurf and Figma. Duplicate the project to create your
                    own customized internal design handbook.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How to Contribute */}
          <section className="w-full space-y-6 pt-8 border-t border-white/10">
            <h2 className="text-[36px] font-bold text-white font-source-code leading-normal">
              How to Contribute (Open Source)
            </h2>

            <p className="font-source-sans text-[16px] text-white/80">
              This guide is an open-source project maintained by the Cloudflare One Design Team, and
              we welcome contributions from the wider community. Your experience and knowledge help
              keep this resource current and comprehensive.
            </p>

            <div className="space-y-6 font-source-sans text-[16px] text-white/80">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Github className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-white mb-2">
                    Report Issues/Suggest Changes
                  </h3>
                  <p>
                    Found a broken link, a typo, or have a suggestion for an even better AI tool
                    for a specific step? Please open a new Issue on our GitHub repository.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-white mb-2">
                    Contribute Content & Code
                  </h3>
                  <p className="mb-3">
                    To add new design phases, integrate a new AI tool, or improve the Windsurf
                    component code:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 pl-4">
                    <li>Fork the repository on GitHub.</li>
                    <li>Create a new feature branch.</li>
                    <li>
                      Submit a detailed Pull Request (PR), clearly linking it to any relevant
                      Issues.
                    </li>
                  </ol>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-white mb-2">
                    Documentation & Examples
                  </h3>
                  <p>
                    We especially welcome contributions that provide real-world examples, case
                    studies, or refined descriptions of the AI&apos;s assistance in action.
                  </p>
                </div>
              </div>

              <div className="bg-navy-800 border border-white/20 rounded-lg p-6 mt-4">
                <p className="text-[14px]">
                  Please review our{" "}
                  <span className="text-orange-500 font-bold">CONTRIBUTING.md</span> and{" "}
                  <span className="text-orange-500 font-bold">CODE_OF_CONDUCT.md</span> files before
                  submitting your first contribution.
                </p>
              </div>
            </div>
          </section>

          {/* Disclaimer & Attribution */}
          <section className="w-full space-y-6 pt-8 border-t border-white/10">
            <h2 className="text-[36px] font-bold text-white font-source-code leading-normal">
              Disclaimer & Attribution
            </h2>

            <div className="space-y-6 font-source-sans text-[16px] text-white/80">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-white mb-2">Proprietary Notice</h3>
                  <p>
                    This resource and its original content were created by and for the Cloudflare
                    One Design Team. The purpose of releasing this project as open source is solely
                    to share a best-practice framework and promote learning within the global design
                    community.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-white mb-2">Open Source License</h3>
                  <p>
                    The content (text, diagrams, framework structure) is licensed under an
                    [appropriate open-source content license, e.g., CC BY 4.0]. All source code is
                    licensed under the [appropriate code license, e.g., MIT].
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-white mb-2">
                    No Warranties & Use at Your Own Risk
                  </h3>
                  <p>
                    This resource is provided &quot;as is&quot; for informational and educational
                    purposes only. We make no guarantees regarding the accuracy, completeness, or
                    suitability of the suggested AI tools or methods for your specific projects. You
                    are responsible for any outcomes resulting from the use of this information in
                    your own workflow.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Copy className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-white mb-2">
                    Duplication and Adaptation
                  </h3>
                  <p>
                    You are welcome to duplicate, fork, and adapt this resource for your own
                    organization&apos;s use, provided you maintain all original attribution and the
                    terms of the open-source license.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
