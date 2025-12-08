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
      className="bg-white/5 hover:bg-white/10 active:bg-transparent flex gap-[10px] items-center justify-center px-[10px] py-[10px] rounded transition-colors"
    >
      <span className="text-orange-500 shrink-0">
        {getIcon(tool.icon)}
      </span>
      <span className="font-source-sans text-[14px] text-orange-500 whitespace-nowrap">
        {tool.name}
      </span>
    </button>
  );
}
