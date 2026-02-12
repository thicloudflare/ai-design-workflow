"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import ThemeToggle from "@/components/ThemeToggle";
import PhaseCard from "@/components/PhaseCard";
import ExpandedView from "@/components/ExpandedView";
import SidePanel from "@/components/SidePanel";
import SearchBar from "@/components/SearchBar";
import { phases as staticPhases } from "@/data/phases";
import type { Phase, Tool } from "@/types";

export default function Home() {
  const [phases, setPhases] = useState<Phase[]>(staticPhases);
  const [loading, setLoading] = useState(true);
  const [activePhase, setActivePhase] = useState<number | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  useEffect(() => {
    loadPhases();
  }, []);

  const loadPhases = async () => {
    try {
      const response = await fetch("/api/phases");
      const data = await response.json();
      if (data.success) {
        setPhases(data.data);
      }
    } catch (error) {
      console.error("Failed to load phases:", error);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen bg-kumo-base text-text-default">
      {/* Main Content */}
      <main className="flex flex-col h-screen overflow-hidden">
        {/* Header - Sticky at top */}
        <div className="sticky top-0 z-10 bg-kumo-base px-8 pt-8 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex-1" />
            <Navigation />
            <div className="flex-1 flex justify-end">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className={`flex-1 flex flex-col items-center px-8 pb-8 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] ${
          activePhase === null ? 'justify-center' : 'justify-start pt-8'
        }`}>
          <div className="w-full max-w-7xl">
            {/* Title and Description */}
            <div className="flex flex-col gap-3 items-center text-center mb-8 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]">
              <h1 className="text-4xl font-semibold text-text-default leading-tight">
                The Designer&apos;s Cheat Code: <span className="text-kumo-brand-text">AI Edition</span>
              </h1>
              <p className="text-lg text-text-subtle max-w-2xl">
                A comprehensive guide for integrating AI capabilities into your design process. 
                Select a phase below to explore AI tools and methods.
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex justify-center mb-8">
              <SearchBar onToolSelect={handleToolClick} />
            </div>

            {/* Phase Cards */}
            <div className="flex gap-8 items-start justify-center w-full mb-8 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]">
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
            <div className={`w-full transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] overflow-hidden ${
              activePhase !== null ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
            }`}>
              {activePhase !== null && (
                <div key={activePhase} className="animate-fadeIn">
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
