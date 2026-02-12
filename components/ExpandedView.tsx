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
    <div ref={containerRef} className="bg-kumo-elevated border border-kumo-brand flex flex-col items-start rounded-lg w-full max-h-[calc(100vh-250px)] overflow-y-auto">
      <div className="flex flex-col gap-6 p-8 w-full">
        {phase.sections.map((section, idx) => (
          <div key={idx} className="flex flex-col gap-3 items-start w-full">
            <h3 className="text-kumo-brand-text font-semibold text-base leading-normal whitespace-nowrap">
              {section.title}
            </h3>
            <div className="flex flex-col gap-3 items-start w-full">
              {section.tools.length > 0 ? (
                section.tools.map((tool, toolIdx) => (
                  <ToolLink
                    key={toolIdx}
                    tool={tool}
                    onClick={() => onToolClick(tool)}
                  />
                ))
              ) : (
                <div className="flex flex-col gap-3 p-4 bg-kumo-recessed border border-kumo-line rounded-lg w-full">
                  <p className="text-text-subtle text-sm">
                    No tools available yet in this section.
                  </p>
                  <Link
                    href="/submit"
                    className="flex items-center gap-2 text-kumo-brand-text hover:text-kumo-brand-hover text-sm font-medium transition-colors"
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
