import { NextResponse } from 'next/server';
import { phases } from '@/data/phases';

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    const toolName = decodeURIComponent(params.name);
    
    for (const phase of phases) {
      for (const section of phase.sections) {
        const tool = section.tools.find(t => t.name === toolName);
        if (tool) {
          return NextResponse.json({
            success: true,
            data: {
              ...tool,
              phase: phase.title,
              phaseNumber: phase.number,
              section: section.title,
            },
          });
        }
      }
    }

    return NextResponse.json(
      { success: false, error: 'Tool not found' },
      { status: 404 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tool' },
      { status: 500 }
    );
  }
}
