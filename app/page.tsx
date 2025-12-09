"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import PhaseCard from "@/components/PhaseCard";
import ExpandedView from "@/components/ExpandedView";
import SidePanel from "@/components/SidePanel";
import { phases } from "@/data/phases";
import type { Phase, Tool } from "@/types";

export default function Home() {
  const [activePhase, setActivePhase] = useState<number | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const handlePhaseClick = (phaseNumber: number) => {
    if (activePhase === phaseNumber) {
      setActivePhase(null);
    } else {
      setActivePhase(phaseNumber);
    }
  };

  const handleToolClick = (tool: Tool) => {
    setSelectedTool(tool);
  };

  const handleCloseSidePanel = () => {
    setSelectedTool(null);
  };

  return (
    <div className="min-h-screen bg-navy-900 text-white">
      {/* Main Content */}
      <main className="flex flex-col h-screen overflow-hidden">
        {/* Header - Sticky at top */}
        <div className="sticky top-0 z-10 bg-navy-900 px-8 pt-8 pb-4 flex-shrink-0">
          <Navigation />
        </div>

        {/* Content Section */}
        <div className={`flex-1 flex flex-col items-center px-8 pb-8 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          activePhase === null ? 'justify-center' : 'justify-start pt-8'
        }`}>
          <div className="w-full max-w-7xl">
            {/* Title and Description */}
            <div className="flex flex-col gap-3 items-center text-center mb-8 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
              <h1 className="text-[48px] font-bold text-white font-source-code leading-tight">
                The Designer&apos;s Cheat Code: <span className="text-[#FFA60C]">AI Edition</span>
              </h1>
              <p className="text-[16px] text-white/70 font-source-sans max-w-2xl">
                A comprehensive guide for integrating AI capabilities into your design process. 
                Select a phase below to explore AI tools and methods.
              </p>
            </div>

            {/* Phase Cards */}
            <div className="flex gap-8 items-start justify-center w-full mb-8 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
              {phases.map((phase) => (
                <PhaseCard
                  key={phase.number}
                  phase={phase}
                  isActive={activePhase === phase.number}
                  onClick={() => handlePhaseClick(phase.number)}
                />
              ))}
            </div>

            {/* Expanded View - Content-hugging with smooth animation */}
            <div className={`w-full transition-all duration-[1500ms] ease-[cubic-bezier(0.19,1,0.22,1)] overflow-hidden ${
              activePhase !== null ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
            }`}>
              {activePhase !== null && (
                <div className="animate-fadeIn">
                  <ExpandedView
                    phase={phases.find((p) => p.number === activePhase) as Phase}
                    onToolClick={handleToolClick}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Side Panel */}
      {selectedTool && (
        <SidePanel tool={selectedTool} onClose={handleCloseSidePanel} />
      )}
    </div>
  );
}
