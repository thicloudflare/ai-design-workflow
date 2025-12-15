import { phases } from './data/phases-data.js';

export function handlePhases(request) {
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

  return new Response(JSON.stringify({
    success: true,
    data: filteredPhases,
    count: filteredPhases.length,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export function handlePhaseById(request, id) {
  const phaseId = parseInt(id);
  
  if (isNaN(phaseId)) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Invalid phase ID'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const phase = phases.find(p => p.number === phaseId);

  if (!phase) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Phase not found'
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({
    success: true,
    data: phase,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export function handleTools(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase();
  const icon = searchParams.get('icon');
  const phase = searchParams.get('phase');

  const allTools = [];

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

  return new Response(JSON.stringify({
    success: true,
    data: filteredTools,
    count: filteredTools.length,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export function handleToolByName(request, name) {
  const toolName = decodeURIComponent(name);
  
  for (const phase of phases) {
    for (const section of phase.sections) {
      const tool = section.tools.find(t => t.name === toolName);
      if (tool) {
        return new Response(JSON.stringify({
          success: true,
          data: {
            ...tool,
            phase: phase.title,
            phaseNumber: phase.number,
            section: section.title,
          },
        }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
  }

  return new Response(JSON.stringify({
    success: false,
    error: 'Tool not found'
  }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function handleSearch(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase();

  if (!query) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Search query is required'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const results = {
    phases: [],
    tools: [],
    sections: [],
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

  return new Response(JSON.stringify({
    success: true,
    query,
    results,
    totalResults,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export function handleStats() {
  let totalTools = 0;
  let totalSections = 0;
  const toolsByIcon = { gemini: 0, miro: 0 };
  const toolsByPhase = {};

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

  return new Response(JSON.stringify({
    success: true,
    data: {
      totalPhases: phases.length,
      totalSections,
      totalTools,
      toolsByIcon,
      toolsByPhase,
      averageToolsPerPhase: (totalTools / phases.length).toFixed(2),
    },
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export function handleSections(request) {
  const { searchParams } = new URL(request.url);
  const phase = searchParams.get('phase');

  const allSections = [];

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

  return new Response(JSON.stringify({
    success: true,
    data: filteredSections,
    count: filteredSections.length,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export function handleHealth() {
  return new Response(JSON.stringify({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'ai-design-workflow-api',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
