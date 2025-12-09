import type { Phase } from "@/types";
import clsx from "clsx";

interface PhaseCardProps {
  phase: Phase;
  isActive: boolean;
  onClick: () => void;
}

export default function PhaseCard({ phase, isActive, onClick }: PhaseCardProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex flex-col items-start gap-1 p-6 rounded transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] text-left",
        isActive 
          ? "bg-navy-800 border-2 border-orange-500" 
          : "border-2 border-transparent"
      )}
    >
      <div className={clsx(
        "text-[24px] font-bold font-source-code leading-none transition-all duration-500",
        isActive ? "text-white" : "text-white"
      )}>
        {phase.number}
      </div>
      <div className={clsx(
        "text-[24px] font-bold font-source-code leading-tight transition-all duration-500",
        isActive ? "text-orange-500" : "text-orange-500/50 hover:text-orange-500/70"
      )}>
        {phase.title}
      </div>
      <div className={clsx(
        "text-[14px] font-source-sans leading-tight mt-1 transition-all duration-500",
        isActive ? "text-white" : "text-white/70"
      )}>
        {phase.description}
      </div>
    </button>
  );
}
