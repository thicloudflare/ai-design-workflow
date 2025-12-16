import { useEffect, useRef } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Phase, Tool } from "@/types";
import ToolLink from "./ToolLink";

interface ExpandedViewProps {
  phase: Phase;
  onToolClick: (tool: Tool) => void;
}

export default function ExpandedView({ phase, onToolClick }: ExpandedViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      setTimeout(() => {
        containerRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
      }, 100);
    }
  }, [phase.number]);

  if (!phase.sections || phase.sections.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className="bg-navy-800 border border-orange-500 flex flex-col items-start rounded w-full max-h-[calc(100vh-250px)] overflow-y-auto">
      <div className="flex flex-col gap-6 p-8 w-full">
        {phase.sections.map((section, idx) => (
          <div key={idx} className="flex flex-col gap-[10px] items-start w-full">
            <h3 className="text-orange-500 font-source-code font-bold text-[16px] leading-normal whitespace-nowrap">
              {section.title}
            </h3>
            <div className="flex flex-col gap-[10px] items-start w-full">
              {section.tools.length > 0 ? (
                section.tools.map((tool, toolIdx) => (
                  <ToolLink
                    key={toolIdx}
                    tool={tool}
                    onClick={() => onToolClick(tool)}
                  />
                ))
              ) : (
                <div className="flex flex-col gap-3 p-4 bg-navy-700 border border-orange-500/30 rounded w-full">
                  <p className="text-white/60 font-source-sans text-[14px]">
                    No tools available yet in this section.
                  </p>
                  <Link
                    href="/submit"
                    className="flex items-center gap-2 text-orange-500 hover:text-orange-400 font-source-sans text-[14px] font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Submit a tool for {section.title}
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
