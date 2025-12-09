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
        "text-left p-6 rounded transition-all duration-300 font-source-code leading-normal flex flex-col gap-3 w-[180px] h-[200px]",
        isActive
          ? "bg-navy-800 border-2 border-solid border-orange-500 scale-105"
          : "bg-navy-800/50 border-2 border-dashed border-white/20 hover:border-white/40 hover:bg-navy-800/70 active:scale-95"
      )}
    >
      <div className="flex flex-col gap-2">
        <div className={clsx(
          "text-[40px] font-bold leading-none",
          isActive ? "text-orange-500" : "text-white"
        )}>
          {phase.number}
        </div>
        <div className="text-[20px] font-bold text-white leading-tight">
          {phase.title}
        </div>
      </div>
      <div className="text-[14px] font-source-sans font-normal text-white/70 line-clamp-3">
        {phase.description}
      </div>
    </button>
  );
}
