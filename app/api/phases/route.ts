import { NextResponse } from 'next/server';
import { phases } from '@/data/phases';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase();
    const icon = searchParams.get('icon');

    let filteredPhases = phases;

    if (search) {
      filteredPhases = phases.map(phase => ({
        ...phase,
        sections: phase.sections.map(section => ({
          ...section,
          tools: section.tools.filter(tool =>
            tool.name.toLowerCase().includes(search) ||
            tool.description.toLowerCase().includes(search)
          ),
        })).filter(section => section.tools.length > 0),
      })).filter(phase => phase.sections.length > 0);
    }

    if (icon) {
      filteredPhases = filteredPhases.map(phase => ({
        ...phase,
        sections: phase.sections.map(section => ({
          ...section,
          tools: section.tools.filter(tool => tool.icon === icon),
        })).filter(section => section.tools.length > 0),
      })).filter(phase => phase.sections.length > 0);
    }

    return NextResponse.json({
      success: true,
      data: filteredPhases,
      count: filteredPhases.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch phases' },
      { status: 500 }
    );
  }
}
