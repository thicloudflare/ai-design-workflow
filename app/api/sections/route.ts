import { NextResponse } from 'next/server';
import { phases } from '@/data/phases';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phase = searchParams.get('phase');

    const allSections: any[] = [];

    phases.forEach(p => {
      p.sections.forEach(section => {
        allSections.push({
          title: section.title,
          phase: p.title,
          phaseNumber: p.number,
          toolCount: section.tools.length,
        });
      });
    });

    let filteredSections = allSections;

    if (phase) {
      const phaseNum = parseInt(phase);
      if (!isNaN(phaseNum)) {
        filteredSections = filteredSections.filter(s => s.phaseNumber === phaseNum);
      }
    }

    return NextResponse.json({
      success: true,
      data: filteredSections,
      count: filteredSections.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sections' },
      { status: 500 }
    );
  }
}
