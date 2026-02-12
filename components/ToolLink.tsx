import type { Tool } from "@/types";
import { Sparkles, Layout } from "lucide-react";

interface ToolLinkProps {
  tool: Tool;
  onClick: () => void;
}

export default function ToolLink({ tool, onClick }: ToolLinkProps) {
  const getIcon = (iconType: string) => {
    if (iconType === "gemini") {
      return <Sparkles className="w-5 h-5" />;
    }
    return <Layout className="w-5 h-5" />;
  };

  return (
    <button
      onClick={onClick}
      className="bg-kumo-tint hover:bg-kumo-interact active:bg-kumo-fill flex gap-3 items-center justify-center px-3 py-2.5 rounded-lg transition-colors"
    >
      <span className="text-kumo-brand-text shrink-0">
        {getIcon(tool.icon)}
      </span>
      <span className="text-sm text-kumo-brand-text whitespace-nowrap">
        {tool.name}
      </span>
    </button>
  );
}
