import { NextResponse } from 'next/server';
import { phases } from '@/data/phases';

export async function GET() {
  try {
    let totalTools = 0;
    let totalSections = 0;
    const toolsByIcon = { gemini: 0, miro: 0 };
    const toolsByPhase: Record<string, number> = {};

    phases.forEach(phase => {
      let phaseToolCount = 0;
      
      phase.sections.forEach(section => {
        totalSections++;
        phaseToolCount += section.tools.length;
        totalTools += section.tools.length;

        section.tools.forEach(tool => {
          toolsByIcon[tool.icon]++;
        });
      });

      toolsByPhase[phase.title] = phaseToolCount;
    });

    return NextResponse.json({
      success: true,
      data: {
        totalPhases: phases.length,
        totalSections,
        totalTools,
        toolsByIcon,
        toolsByPhase,
        averageToolsPerPhase: (totalTools / phases.length).toFixed(2),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
