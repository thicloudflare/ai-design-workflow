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
 * - default: Transparent background, reduced opacity
 * - hover: Increased opacity, subtle background
 * - active: Navy background with orange border, full opacity
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
          ? "bg-navy-800 border-2 border-orange-500" 
          : "border-2 border-transparent hover:bg-navy-800/30",
        // Interaction states
        !isActive && "active:scale-[0.98]"
      )}
    >
      {/* Number */}
      <div className={clsx(
        "text-[24px] font-bold font-source-code leading-none transition-all duration-500",
        "text-white"
      )}>
        {phase.number}
      </div>
      
      {/* Title */}
      <div className={clsx(
        "text-[24px] font-bold font-source-code leading-tight transition-all duration-500",
        isActive 
          ? "text-orange-500" 
          : "text-orange-500/50 group-hover:text-orange-500/70"
      )}>
        {phase.title}
      </div>
      
      {/* Description */}
      <div className={clsx(
        "text-[14px] font-source-sans leading-tight transition-all duration-500",
        isActive 
          ? "text-white" 
          : "text-white/60"
      )}>
        {phase.description}
      </div>
    </button>
  );
}
