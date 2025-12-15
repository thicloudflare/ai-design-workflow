import { NextResponse } from 'next/server';
import { phases } from '@/data/phases';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase();

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    const results = {
      phases: [] as any[],
      tools: [] as any[],
      sections: [] as any[],
    };

    phases.forEach(phase => {
      if (
        phase.title.toLowerCase().includes(query) ||
        phase.description.toLowerCase().includes(query)
      ) {
        results.phases.push({
          number: phase.number,
          title: phase.title,
          description: phase.description,
          type: 'phase',
        });
      }

      phase.sections.forEach(section => {
        if (section.title.toLowerCase().includes(query)) {
          results.sections.push({
            title: section.title,
            phase: phase.title,
            phaseNumber: phase.number,
            type: 'section',
          });
        }

        section.tools.forEach(tool => {
          if (
            tool.name.toLowerCase().includes(query) ||
            tool.description.toLowerCase().includes(query)
          ) {
            results.tools.push({
              name: tool.name,
              description: tool.description,
              icon: tool.icon,
              url: tool.url,
              phase: phase.title,
              phaseNumber: phase.number,
              section: section.title,
              type: 'tool',
            });
          }
        });
      });
    });

    const totalResults = results.phases.length + results.tools.length + results.sections.length;

    return NextResponse.json({
      success: true,
      query,
      results,
      totalResults,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}
