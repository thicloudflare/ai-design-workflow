import type { Phase } from "@/types";
import clsx from "clsx";

interface PhaseCardProps {
  phase: Phase;
  isActive: boolean;
  onClick: () => void;
  variant?: "default" | "compact";
}

/**
 * PhaseCard Component
 * 
 * Variants:
 * - default: Full card with number, title, and description
 * - compact: Simplified version (future use)
 * 
 * States:
 * - default: Transparent background, full opacity
 * - hover: Tint background
 * - active: Elevated background with brand border
 * - press: Scale-down effect on inactive cards
 */
export default function PhaseCard({ 
  phase, 
  isActive, 
  onClick,
  variant = "default" 
}: PhaseCardProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex flex-col items-start gap-2 p-6 rounded-lg transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] text-left",
        // Border and background variants
        isActive 
          ? "bg-kumo-elevated border-2 border-kumo-brand" 
          : "border-2 border-kumo-line hover:bg-kumo-tint",
        // Interaction states
        !isActive && "active:scale-[0.98]"
      )}
    >
      {/* Number */}
      <div className="text-2xl font-semibold leading-none text-text-default transition-all duration-500">
        {phase.number}
      </div>
      
      {/* Title */}
      <div className={clsx(
        "text-2xl font-semibold leading-tight transition-all duration-500",
        isActive ? "text-kumo-brand-text" : "text-kumo-brand-text"
      )}>
        {phase.title}
      </div>
      
      {/* Description */}
      <div className={clsx(
        "text-sm leading-tight transition-all duration-500",
        "text-text-subtle"
      )}>
        {phase.description}
      </div>
    </button>
  );
}
