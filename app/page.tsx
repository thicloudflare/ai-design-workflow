"use client";

import { useState } from "react";
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
      <main className="flex flex-col gap-[100px] items-center p-8 min-h-screen">
        {/* Header */}
        <div className="flex gap-6 items-start justify-center font-source-code text-[16px] text-center underline w-full">
          <a
            href="#"
            className="text-white hover:text-white/80 transition-colors"
          >
            How to contribute
          </a>
          <a
            href="#"
            className="text-white hover:text-white/80 transition-colors"
          >
            Disclaimer
          </a>
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-[64px] items-center w-full max-w-7xl flex-1">
          <h1 className="text-[48px] font-bold text-center text-white font-source-code leading-normal">
            The AI-Enhanced Design Workflow
          </h1>

          <div className="flex flex-col gap-6 items-center px-8 w-full">
            {/* Phase Cards */}
            <div className="flex gap-6 items-start justify-center w-full">
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
