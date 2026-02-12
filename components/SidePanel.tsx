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
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-[480px] bg-kumo-overlay z-50 overflow-y-auto rounded-tl-lg rounded-bl-lg animate-slideInRight">
        {/* Header */}
        <div className="border-b border-kumo-line flex flex-col gap-4 p-6">
          <div className="flex gap-[74px] items-center justify-between">
            <div className="flex gap-3 items-center">
              <span className="text-kumo-brand-text">{getIcon(tool.icon)}</span>
              <h2 className="font-semibold text-lg text-kumo-brand-text leading-normal">
                {tool.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-text-default hover:text-kumo-brand-text transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* CTA Button */}
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-kumo-brand flex gap-3 items-center justify-center px-4 py-2 rounded-lg transition-colors hover:bg-kumo-brand/10"
          >
            <span className="text-base text-text-default">
              Launch tool
            </span>
            <ExternalLink className="w-4 h-4 text-text-default" />
          </a>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6 p-6">
          {/* Description */}
          <p className="text-base text-text-default leading-normal">
            {tool.description}
          </p>

          {/* Core Output Focus */}
          {tool.coreOutputFocus && tool.coreOutputFocus.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-base text-kumo-brand-text">
                Core Output Focus:
              </h3>
              
              {/* Table format for tools with multiple frames (e.g., PRD review) */}
              {tool.coreOutputFocus.length > 1 ? (
                <div className="border border-kumo-line rounded-lg overflow-hidden">
                  {/* Table Header */}
                  <div className="flex border-b border-kumo-line bg-kumo-tint">
                    <div className="w-[150px] px-4 py-2 font-semibold text-sm text-text-default">
                      Frame
                    </div>
                    <div className="flex-1 px-4 py-2 border-l border-kumo-line font-semibold text-sm text-text-default">
                      Key deliverables
                    </div>
                  </div>
                  {/* Table Rows */}
                  {tool.coreOutputFocus.map((output, idx) => (
                    <div key={idx} className="flex border-b border-kumo-line last:border-b-0 min-h-[48px]">
                      <div className="w-[150px] px-4 py-2 flex flex-col gap-2">
                        <div className="font-semibold text-xs text-kumo-brand-text mb-2">
                          {output.frame}
                        </div>
                        {output.details && output.details.map((detail, detailIdx) => (
                          <div key={detailIdx} className="text-xs text-text-subtle leading-5">
                            {detail.description}
                          </div>
                        ))}
                      </div>
                      <div className="flex-1 px-4 py-2 border-l border-kumo-line text-xs text-text-default leading-5">
                        {output.keyDeliverables}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Bullet point format for single-section tools */
                <>
                  <p className="text-sm text-text-subtle leading-normal">
                    {tool.coreOutputFocus[0]?.keyDeliverables}
                  </p>
                  <ul className="space-y-2">
                    {tool.coreOutputFocus[0]?.details?.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-kumo-brand-text mt-1 flex-shrink-0">•</span>
                        <div>
                          <span className="font-semibold text-sm text-text-default">
                            {detail.title}:
                          </span>
                          <span className="text-sm text-text-subtle ml-1">
                            {detail.description}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}

          {/* Instructions */}
          {tool.instructions && tool.instructions.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-base text-kumo-brand-text">
                Instructions:
              </h3>
              <div className="text-xs text-text-default leading-normal whitespace-pre-line">
                {tool.instructions.join('\n\n')}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
