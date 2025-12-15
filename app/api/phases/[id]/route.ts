import { NextResponse } from 'next/server';
import { phases } from '@/data/phases';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const phaseId = parseInt(params.id);
    
    if (isNaN(phaseId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid phase ID' },
        { status: 400 }
      );
    }

    const phase = phases.find(p => p.number === phaseId);

    if (!phase) {
      return NextResponse.json(
        { success: false, error: 'Phase not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: phase,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch phase' },
      { status: 500 }
    );
  }
}
