import type { Phase, Tool, Section } from './index';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}

export interface ToolWithContext extends Tool {
  phase: string;
  phaseNumber: number;
  section: string;
}

export interface SectionWithContext {
  title: string;
  phase: string;
  phaseNumber: number;
  toolCount: number;
}

export interface SearchResult {
  phases: PhaseSearchResult[];
  tools: ToolSearchResult[];
  sections: SectionSearchResult[];
}

export interface PhaseSearchResult {
  number: number;
  title: string;
  description: string;
  type: 'phase';
}

export interface ToolSearchResult extends ToolWithContext {
  type: 'tool';
}

export interface SectionSearchResult extends SectionWithContext {
  type: 'section';
}

export interface SearchResponse {
  success: boolean;
  query: string;
  results: SearchResult;
  totalResults: number;
}

export interface StatsData {
  totalPhases: number;
  totalSections: number;
  totalTools: number;
  toolsByIcon: {
    gemini: number;
    miro: number;
  };
  toolsByPhase: Record<string, number>;
  averageToolsPerPhase: string;
}

export interface HealthResponse {
  success: boolean;
  status: string;
  timestamp: string;
  version: string;
  service: string;
}

export interface SubmitToolRequest {
  toolName: string;
  description?: string;
  url: string;
  step: string;
  substep: string;
  instruction?: string;
  submitterEmail: string;
}

export interface SubmitToolResponse {
  success: boolean;
  message?: string;
  error?: string;
}
