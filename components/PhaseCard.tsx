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
      className="transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
    >
      <span className={clsx(
        "text-[32px] font-bold font-source-code transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        isActive ? "text-orange-500 scale-110" : "text-orange-500/50 hover:text-orange-500/70 scale-100"
      )}>
        {phase.title}
      </span>
    </button>
  );
}
