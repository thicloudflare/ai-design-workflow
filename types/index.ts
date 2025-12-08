export interface Phase {
  number: number;
  title: string;
  description: string;
  sections: Section[];
}

export interface Section {
  title: string;
  tools: Tool[];
}

export interface Tool {
  name: string;
  icon: "gemini" | "miro";
  url: string;
  description: string;
  coreOutputFocus?: CoreOutputFrame[];
  instructions?: string[];
}

export interface CoreOutputFrame {
  frame: string;
  keyDeliverables: string;
  details?: FrameDetail[];
}

export interface FrameDetail {
  title: string;
  description: string;
}
