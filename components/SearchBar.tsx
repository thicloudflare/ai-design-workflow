"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { phases } from "@/data/phases";
import type { Tool } from "@/types";

interface SearchResult {
  tool: Tool;
  phaseNumber: number;
  phaseTitle: string;
  sectionTitle: string;
}

interface SearchBarProps {
  onToolSelect: (tool: Tool) => void;
}

export default function SearchBar({ onToolSelect }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Index all tools
  const allTools: SearchResult[] = phases.flatMap((phase) =>
    phase.sections.flatMap((section) =>
      section.tools.map((tool) => ({
        tool,
        phaseNumber: phase.number,
        phaseTitle: phase.title,
        sectionTitle: section.title,
      }))
    )
  );

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = allTools.filter(
        (result) =>
          result.tool.name.toLowerCase().includes(query) ||
          result.tool.description?.toLowerCase().includes(query) ||
          result.phaseTitle.toLowerCase().includes(query) ||
          result.sectionTitle.toLowerCase().includes(query)
      );
      setSearchResults(filtered);
      setIsOpen(true);
    } else {
      setSearchResults([]);
      setIsOpen(false);
    }
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToolClick = (result: SearchResult) => {
    onToolSelect(result.tool);
    setSearchQuery("");
    setIsOpen(false);
  };

  const handleClear = () => {
    setSearchQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-inactive" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tools..."
          className="w-full bg-kumo-elevated border border-kumo-line rounded-lg pl-12 pr-12 py-3 text-base text-text-default placeholder:text-text-inactive focus:outline-none focus:border-kumo-brand focus:ring-1 focus:ring-kumo-brand transition-colors"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-inactive hover:text-text-default transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-kumo-overlay border border-kumo-line rounded-lg shadow-2xl max-h-96 overflow-y-auto">
          <div className="py-2">
            {searchResults.map((result, idx) => (
              <button
                key={idx}
                onClick={() => handleToolClick(result)}
                className="w-full text-left px-4 py-3 hover:bg-kumo-tint transition-colors border-b border-kumo-line last:border-b-0"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-text-default mb-1">
                      {result.tool.name}
                    </div>
                    <div className="text-xs text-text-subtle line-clamp-2 mb-2">
                      {result.tool.description}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-kumo-brand-text font-semibold">
                        {result.phaseNumber}. {result.phaseTitle}
                      </span>
                      <span className="text-text-inactive">→</span>
                      <span className="text-text-subtle">
                        {result.sectionTitle}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && searchQuery && searchResults.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-kumo-overlay border border-kumo-line rounded-lg shadow-2xl p-4">
          <p className="text-sm text-text-subtle text-center">
            No tools found for &quot;{searchQuery}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
