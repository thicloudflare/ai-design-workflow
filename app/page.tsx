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
      <main className="flex flex-col items-center h-screen p-8 pb-8 overflow-hidden">
        {/* Header - Fixed at top */}
        <div className="w-full mb-8 flex-shrink-0">
          <Navigation />
        </div>

        {/* Content Section - Centered when collapsed, moves up when expanded */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-7xl min-h-0 overflow-hidden">
          <div 
            className={`flex flex-col items-center w-full transition-transform duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
              activePhase !== null ? '-translate-y-4' : 'translate-y-0'
            }`}
          >
            {/* Title and Description */}
            <div className="flex flex-col gap-3 items-center text-center mt-4 flex-shrink-0">
              <h1 className="text-[40px] font-bold text-white font-source-code leading-tight">
                The AI-Enhanced Design Workflow
              </h1>
              <p className="text-[16px] text-white/70 font-source-sans max-w-2xl">
                A comprehensive guide for integrating AI capabilities into your design process. 
                Select a phase below to explore AI tools and methods.
              </p>
            </div>

            <div className="flex flex-col gap-6 items-center px-8 w-full mt-8 flex-1 min-h-0">
              {/* Phase Cards */}
              <div className="flex gap-6 items-start justify-center w-full flex-wrap flex-shrink-0">
                {phases.map((phase) => (
                  <PhaseCard
                    key={phase.number}
                    phase={phase}
                    isActive={activePhase === phase.number}
                    onClick={() => handlePhaseClick(phase.number)}
                  />
                ))}
              </div>

              {/* Expanded View - Flexible height container */}
              <div className={`w-full transition-all duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                activePhase !== null ? 'flex-1 min-h-0' : 'h-0'
              }`}>
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
