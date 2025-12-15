import { useEffect, useRef } from "react";
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
                <p className="text-white/40 font-source-sans text-[14px] italic">
                  Tools coming soon...
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
