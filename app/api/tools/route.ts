import { NextResponse } from 'next/server';
import { phases } from '@/data/phases';
import type { Tool } from '@/types';

interface ToolWithContext extends Tool {
  phase: string;
  phaseNumber: number;
  section: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase();
    const icon = searchParams.get('icon');
    const phase = searchParams.get('phase');

    const allTools: ToolWithContext[] = [];

    phases.forEach(p => {
      p.sections.forEach(section => {
        section.tools.forEach(tool => {
          allTools.push({
            ...tool,
            phase: p.title,
            phaseNumber: p.number,
            section: section.title,
          });
        });
      });
    });

    let filteredTools = allTools;

    if (search) {
      filteredTools = filteredTools.filter(
        tool =>
          tool.name.toLowerCase().includes(search) ||
          tool.description.toLowerCase().includes(search) ||
          tool.phase.toLowerCase().includes(search) ||
          tool.section.toLowerCase().includes(search)
      );
    }

    if (icon) {
      filteredTools = filteredTools.filter(tool => tool.icon === icon);
    }

    if (phase) {
      const phaseNum = parseInt(phase);
      if (!isNaN(phaseNum)) {
        filteredTools = filteredTools.filter(tool => tool.phaseNumber === phaseNum);
      }
    }

    return NextResponse.json({
      success: true,
      data: filteredTools,
      count: filteredTools.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tools' },
      { status: 500 }
    );
  }
}
