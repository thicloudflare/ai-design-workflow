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
      className="transition-all duration-200"
    >
      <span className={clsx(
        "text-[32px] font-bold font-source-code",
        isActive ? "text-orange-500" : "text-orange-500/50 hover:text-orange-500/70"
      )}>
        {phase.title}
      </span>
    </button>
  );
}
