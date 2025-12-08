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
        "text-left p-[10px] rounded transition-all duration-200 font-source-code leading-normal flex flex-col gap-2",
        isActive
          ? "bg-navy-800 border-2 border-solid border-orange-500"
          : "border-2 border-transparent hover:bg-white/10 active:bg-white/5"
      )}
    >
      <div className="flex flex-col gap-1">
        <div className="text-[32px] font-bold text-white">
          {phase.number}
        </div>
        <div className="text-[28px] font-bold text-orange-500">
          {phase.title}
        </div>
      </div>
      <div className="text-[16px] font-source-sans font-normal text-white">
        {phase.description}
      </div>
    </button>
  );
}
