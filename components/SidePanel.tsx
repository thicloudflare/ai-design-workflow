import { X, ExternalLink, Sparkles, Layout } from "lucide-react";
import type { Tool } from "@/types";

interface SidePanelProps {
  tool: Tool;
  onClose: () => void;
}

export default function SidePanel({ tool, onClose }: SidePanelProps) {
  const getIcon = (iconType: string) => {
    if (iconType === "gemini") {
      return <Sparkles className="w-6 h-6" />;
    }
    return <Layout className="w-6 h-6" />;
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-40 animate-fadeIn"
        onClick={onClose}
      />

      {/* Side Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-[480px] bg-navy-900 z-50 overflow-y-auto rounded-tl-lg rounded-bl-lg animate-slideInRight">
        {/* Header */}
        <div className="border-b border-white/25 flex flex-col gap-4 p-6">
          <div className="flex gap-[74px] items-center justify-between">
            <div className="flex gap-[10px] items-center">
              <span className="text-orange-500">{getIcon(tool.icon)}</span>
              <h2 className="font-source-sans font-bold text-[18px] text-orange-500 leading-normal">
                {tool.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-orange-500 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* CTA Button */}
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-orange-500 flex gap-[10px] items-center justify-center px-4 py-2 rounded transition-colors hover:bg-orange-500/10"
          >
            <span className="font-source-sans text-[16px] text-white">
              Try out Gem
            </span>
            <ExternalLink className="w-4 h-4 text-white" />
          </a>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6 p-6">
          {/* Description */}
          <p className="font-source-sans text-[16px] text-white leading-normal">
            {tool.description}
          </p>

          {/* Core Output Focus */}
          {tool.coreOutputFocus && tool.coreOutputFocus.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="font-source-sans font-bold text-[16px] text-orange-500">
                Core Output Focus:
              </h3>
              <div className="border border-white/20 rounded overflow-hidden">
                {/* Table Header */}
                <div className="flex border-b border-white/20">
                  <div className="w-[150px] px-4 py-2 font-source-sans font-bold text-[14px] text-white">
                    Frame
                  </div>
                  <div className="flex-1 px-4 py-2 border-l border-white/20 font-source-sans font-bold text-[14px] text-white">
                    Key deliverables
                  </div>
                </div>
                {/* Table Rows */}
                {tool.coreOutputFocus.map((output, idx) => (
                  <div key={idx} className="flex border-b border-white/20 min-h-[48px]">
                    <div className="w-[150px] px-4 py-2 flex flex-col gap-2">
                      <div className="font-source-sans font-bold text-[12px] text-orange-500 mb-2">
                        {output.frame}
                      </div>
                      {output.details && output.details.map((detail, detailIdx) => (
                        <div key={detailIdx} className="font-source-sans text-[12px] text-white leading-5">
                          {detail.description}
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 px-4 py-2 border-l border-white/20 font-source-sans text-[12px] text-white leading-5">
                      {output.keyDeliverables}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          {tool.instructions && tool.instructions.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="font-source-sans font-bold text-[16px] text-orange-500">
                Instructions:
              </h3>
              <div className="font-source-sans text-[12px] text-white leading-normal whitespace-pre-line">
                {tool.instructions.join('\n\n')}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
