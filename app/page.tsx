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
      <main className="flex flex-col items-center h-screen p-6 overflow-hidden">
        {/* Header - Fixed at top */}
        <div className="w-full mb-6 flex-shrink-0">
          <Navigation />
        </div>

        {/* Content Section - Centered when collapsed, moves up when expanded */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-7xl overflow-hidden">
          <div 
            className={`flex flex-col gap-8 items-center w-full transition-transform duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
              activePhase !== null ? '-translate-y-12' : 'translate-y-0'
            }`}
            style={{ minHeight: '0' }}
          >
            {/* Title and Description */}
            <div className="flex flex-col gap-3 items-center text-center flex-shrink-0">
              <h1 className="text-[48px] font-bold text-white font-source-code leading-tight">
                The AI-Enhanced Design Workflow
              </h1>
              <p className="text-[16px] text-white/70 font-source-sans max-w-2xl">
                A comprehensive guide for integrating AI capabilities into your design process. 
                Select a phase below to explore AI tools and methods.
              </p>
            </div>

            {/* Phase Cards and Expansion */}
            <div className="flex flex-col gap-4 items-center w-full flex-shrink-0">
              {/* Phase Cards */}
              <div className="flex gap-4 items-start justify-center w-full flex-wrap">
                {phases.map((phase) => (
                  <PhaseCard
                    key={phase.number}
                    phase={phase}
                    isActive={activePhase === phase.number}
                    onClick={() => handlePhaseClick(phase.number)}
                  />
                ))}
              </div>

              {/* Expanded View - Fixed large height container */}
              <div 
                className={`w-full transition-all duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)] overflow-hidden ${
                  activePhase !== null ? 'h-[520px] opacity-100' : 'h-0 opacity-0'
                }`}
              >
                {activePhase !== null && (
                  <ExpandedView
                    phase={phases.find((p) => p.number === activePhase) as Phase}
                    onToolClick={handleToolClick}
                  />
                )}
              </div>
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
