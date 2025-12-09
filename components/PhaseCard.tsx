import type { Phase } from "@/types";
import clsx from "clsx";

interface PhaseCardProps {
  phase: Phase;
  isActive: boolean;
  onClick: () => void;
}

export default function PhaseCard({ phase, isActive, onClick }: PhaseCardProps) {
  if (isActive) {
    // Active state: Full card with number, title, and description
    return (
      <button
        onClick={onClick}
        className="flex flex-col gap-2 p-6 bg-navy-800 border-2 border-orange-500 rounded transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] text-left min-w-[200px]"
      >
        <div className="text-[24px] font-bold text-white font-source-code leading-none">
          {phase.number}
        </div>
        <div className="text-[24px] font-bold text-orange-500 font-source-code leading-tight">
          {phase.title}
        </div>
        <div className="text-[14px] font-source-sans text-white leading-tight">
          {phase.description}
        </div>
      </button>
    );
  }

  // Default state: Just title in orange
  return (
    <button
      onClick={onClick}
      className="transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
    >
      <span className="text-[32px] font-bold font-source-code text-orange-500/50 hover:text-orange-500/70 transition-all duration-500">
        {phase.title}
      </span>
    </button>
  );
}
