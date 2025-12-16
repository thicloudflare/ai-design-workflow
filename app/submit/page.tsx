"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import CreatableSelect from "@/components/CreatableSelect";
import { phases } from "@/data/phases";

export default function SubmitTool() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    toolName: "",
    description: "",
    url: "",
    icon: "gemini" as "gemini" | "miro",
    step: "",
    substep: "",
    instruction: "",
    submitterEmail: "",
    submitterName: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  // Get available substeps based on selected step
  const getSubsteps = () => {
    if (!formData.step) return [];
    // Check if step is a phase number or custom text
    const phaseMatch = formData.step.match(/^(\d+)/);
    if (phaseMatch) {
      const phaseNumber = parseInt(phaseMatch[1]);
      const phase = phases.find((p) => p.number === phaseNumber);
      return phase?.sections.map((s) => s.title) || [];
    }
    return [];
  };

  // Get available step options
  const getStepOptions = () => {
    return phases.map((phase) => `${phase.number}. ${phase.title}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const phaseMatch = formData.step.match(/^(\d+)/);
    const phaseNumber = phaseMatch ? parseInt(phaseMatch[1]) : null;
    const phase = phases.find((p) => p.number === phaseNumber);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.submitterName,
          email: formData.submitterEmail,
          toolName: formData.toolName,
          toolUrl: formData.url,
          description: formData.description,
          icon: "gemini",
          phaseNumber: phaseNumber,
          phaseTitle: phase?.title || formData.step,
          sectionTitle: formData.substep,
          useCase: formData.instruction,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Redirect to success page
        router.push('/submit/success');
      } else {
        setSubmitStatus("error");
        console.error('Submission failed:', result.error);
      }
    } catch (error) {
      setSubmitStatus("error");
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset substep if step changes
      ...(name === "step" ? { substep: "" } : {}),
    }));
  };

  return (
    <div className="min-h-screen bg-navy-900 text-white">
      <main className="flex flex-col gap-[64px] items-center p-8 min-h-screen">
        <Navigation />

        <div className="flex flex-col gap-[32px] items-center w-full max-w-2xl">
          <h1 className="text-[48px] font-bold text-center text-white font-source-code leading-normal">
            Submit a Tool
          </h1>

          <p className="text-white/80 font-source-sans text-[16px] text-center">
            Help expand the AI-Enhanced Design Workflow by submitting tools you&apos;ve found useful.
            Your submission will be reviewed and added to the appropriate workflow stage.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            {/* Submitter Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="submitterName" className="font-source-code text-[14px] text-white">
                Your Name <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                id="submitterName"
                name="submitterName"
                required
                value={formData.submitterName}
                onChange={handleChange}
                className="bg-navy-800 border border-white/20 rounded px-4 py-3 font-source-sans text-[16px] text-white focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="John Doe"
              />
            </div>

            {/* Submitter Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="submitterEmail" className="font-source-code text-[14px] text-white">
                Your Email <span className="text-orange-500">*</span>
              </label>
              <input
                type="email"
                id="submitterEmail"
                name="submitterEmail"
                required
                value={formData.submitterEmail}
                onChange={handleChange}
                className="bg-navy-800 border border-white/20 rounded px-4 py-3 font-source-sans text-[16px] text-white focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="your.email@example.com"
              />
              <p className="text-white/60 font-source-sans text-[12px]">
                We&apos;ll notify you when your submission is approved.
              </p>
            </div>

            {/* Tool Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="toolName" className="font-source-code text-[14px] text-white">
                Tool Name <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                id="toolName"
                name="toolName"
                required
                value={formData.toolName}
                onChange={handleChange}
                className="bg-navy-800 border border-white/20 rounded px-4 py-3 font-source-sans text-[16px] text-white focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="e.g., Figma, ChatGPT, Midjourney"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label htmlFor="description" className="font-source-code text-[14px] text-white">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="bg-navy-800 border border-white/20 rounded px-4 py-3 font-source-sans text-[16px] text-white focus:outline-none focus:border-orange-500 transition-colors resize-vertical"
                placeholder="Brief description of what the tool does and how it helps..."
              />
            </div>

            {/* URL */}
            <div className="flex flex-col gap-2">
              <label htmlFor="url" className="font-source-code text-[14px] text-white">
                URL <span className="text-orange-500">*</span>
              </label>
              <input
                type="url"
                id="url"
                name="url"
                required
                value={formData.url}
                onChange={handleChange}
                className="bg-navy-800 border border-white/20 rounded px-4 py-3 font-source-sans text-[16px] text-white focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="https://example.com"
              />
            </div>

            {/* Step Dropdown */}
            <div className="flex flex-col gap-2">
              <label htmlFor="step" className="font-source-code text-[14px] text-white">
                Which Step? <span className="text-orange-500">*</span>
              </label>
              <CreatableSelect
                id="step"
                name="step"
                value={formData.step}
                onChange={(value) => setFormData((prev) => ({ ...prev, step: value, substep: "" }))}
                options={getStepOptions()}
                placeholder="Select or type to add new step..."
                required
              />
              <p className="text-white/60 font-source-sans text-[12px]">
                Select from the list or type to create a custom step
              </p>
            </div>

            {/* Substep Dropdown */}
            <div className="flex flex-col gap-2">
              <label htmlFor="substep" className="font-source-code text-[14px] text-white">
                Which Substep? <span className="text-orange-500">*</span>
              </label>
              <CreatableSelect
                id="substep"
                name="substep"
                value={formData.substep}
                onChange={(value) => setFormData((prev) => ({ ...prev, substep: value }))}
                options={getSubsteps()}
                placeholder={formData.step ? "Select or type to add new substep..." : "Select a step first..."}
                required
                disabled={!formData.step}
              />
              <p className="text-white/60 font-source-sans text-[12px]">
                Select from the list or type to create a custom substep
              </p>
            </div>

            {/* Optional Instruction */}
            <div className="flex flex-col gap-2">
              <label htmlFor="instruction" className="font-source-code text-[14px] text-white">
                Optional Instruction
              </label>
              <textarea
                id="instruction"
                name="instruction"
                value={formData.instruction}
                onChange={handleChange}
                rows={3}
                className="bg-navy-800 border border-white/20 rounded px-4 py-3 font-source-sans text-[16px] text-white focus:outline-none focus:border-orange-500 transition-colors resize-vertical"
                placeholder="Any specific instructions or tips for using this tool in this context..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:bg-orange-500/50 disabled:cursor-not-allowed text-white font-source-code text-[16px] py-4 rounded transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Submit Tool for Approval"}
            </button>

            {/* Error Message */}
            {submitStatus === "error" && (
              <div className="bg-red-500/10 border border-red-500/50 rounded px-4 py-3 font-source-sans text-[14px] text-red-400">
                ✗ Failed to submit. Please try again or contact support.
              </div>
            )}
          </form>

          <p className="text-white/60 font-source-sans text-[14px] text-center">
            Submissions will be sent to <span className="text-orange-500">thi@cloudflare.com</span> for review.
          </p>
        </div>
      </main>
    </div>
  );
}
