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
      <main className="flex flex-col items-center min-h-screen p-8">
        {/* Header - Fixed at top */}
        <div className="w-full mb-8">
          <Navigation />
        </div>

        {/* Content Section - Centered when collapsed, moves up when expanded */}
        <div 
          className={`flex flex-col gap-[64px] items-center w-full max-w-7xl transition-all duration-700 ease-in-out ${
            activePhase === null 
              ? 'flex-1 justify-center' 
              : 'justify-start'
          }`}
        >
          {/* Title and Description */}
          <div className="flex flex-col gap-4 items-center text-center transition-all duration-700">
            <h1 className="text-[48px] font-bold text-white font-source-code leading-normal">
              The AI-Enhanced Design Workflow
            </h1>
            <p className="text-[18px] text-white/70 font-source-sans max-w-3xl">
              A comprehensive guide for integrating AI capabilities into your design process. 
              Select a phase below to explore AI tools and methods.
            </p>
          </div>

          <div className="flex flex-col gap-6 items-center px-8 w-full">
            {/* Phase Cards */}
            <div className="flex gap-6 items-start justify-center w-full flex-wrap">
              {phases.map((phase) => (
                <PhaseCard
                  key={phase.number}
                  phase={phase}
                  isActive={activePhase === phase.number}
                  onClick={() => handlePhaseClick(phase.number)}
                />
              ))}
            </div>

            {/* Expanded View */}
            {activePhase !== null && (
              <ExpandedView
                phase={phases.find((p) => p.number === activePhase) as Phase}
                onToolClick={handleToolClick}
              />
            )}
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
