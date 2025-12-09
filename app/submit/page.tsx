"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import { phases } from "@/data/phases";

export default function SubmitTool() {
  const [formData, setFormData] = useState({
    toolName: "",
    description: "",
    url: "",
    step: "",
    substep: "",
    instruction: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  // Get available substeps based on selected step
  const getSubsteps = () => {
    if (!formData.step) return [];
    const phaseNumber = parseInt(formData.step);
    const phase = phases.find((p) => p.number === phaseNumber);
    return phase?.sections || [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const phase = phases.find((p) => p.number === parseInt(formData.step));
    const substep = phase?.sections.find((s) => s.title === formData.substep);

    const emailBody = `
New Tool Submission

Tool Name: ${formData.toolName}
Description: ${formData.description}
URL: ${formData.url}
Step: ${formData.step} - ${phase?.title || ""}
Substep: ${formData.substep}
${formData.instruction ? `Instruction: ${formData.instruction}` : ""}

---
Submitted via AI-Enhanced Design Workflow
    `.trim();

    const mailtoLink = `mailto:thi@cloudflare.com?subject=${encodeURIComponent(
      `Tool Submission: ${formData.toolName}`
    )}&body=${encodeURIComponent(emailBody)}`;

    // Open mailto link
    window.location.href = mailtoLink;

    // Reset form after a short delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({
        toolName: "",
        description: "",
        url: "",
        step: "",
        substep: "",
        instruction: "",
      });
    }, 1000);
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
              <select
                id="step"
                name="step"
                required
                value={formData.step}
                onChange={handleChange}
                className="bg-navy-800 border border-white/20 rounded px-4 py-3 font-source-sans text-[16px] text-white focus:outline-none focus:border-orange-500 transition-colors cursor-pointer"
              >
                <option value="">Select a step...</option>
                {phases.map((phase) => (
                  <option key={phase.number} value={phase.number}>
                    {phase.number}. {phase.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Substep Dropdown */}
            <div className="flex flex-col gap-2">
              <label htmlFor="substep" className="font-source-code text-[14px] text-white">
                Which Substep? <span className="text-orange-500">*</span>
              </label>
              <select
                id="substep"
                name="substep"
                required
                value={formData.substep}
                onChange={handleChange}
                disabled={!formData.step}
                className="bg-navy-800 border border-white/20 rounded px-4 py-3 font-source-sans text-[16px] text-white focus:outline-none focus:border-orange-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {formData.step ? "Select a substep..." : "Select a step first..."}
                </option>
                {getSubsteps().map((section, idx) => (
                  <option key={idx} value={section.title}>
                    {section.title}
                  </option>
                ))}
              </select>
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

            {/* Success Message */}
            {submitStatus === "success" && (
              <div className="bg-green-500/10 border border-green-500/50 rounded px-4 py-3 font-source-sans text-[14px] text-green-400">
                ✓ Your email client should open with the submission. Thank you!
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
