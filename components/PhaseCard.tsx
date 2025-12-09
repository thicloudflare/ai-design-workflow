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
        "px-4 py-3 rounded transition-all duration-300 font-source-code leading-none",
        isActive
          ? "bg-navy-800 border-2 border-solid border-orange-500"
          : "bg-transparent border-2 border-transparent hover:bg-white/5"
      )}
    >
      <div className="flex items-baseline gap-2">
        <span className={clsx(
          "text-[24px] font-bold",
          isActive ? "text-orange-500" : "text-white"
        )}>
          {phase.number}
        </span>
        <span className={clsx(
          "text-[24px] font-bold",
          isActive ? "text-orange-500" : "text-white"
        )}>
          {phase.title}
        </span>
      </div>
    </button>
  );
}
