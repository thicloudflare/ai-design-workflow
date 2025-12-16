import { phases } from './data/phases-data.js';

/**
 * Consolidated Cloudflare Worker - All API handlers in one file
 */

// ===== EMAIL HANDLER =====
async function sendEmail(env, submission) {
  if (!env.RESEND_API_KEY) {
    console.log('⚠️ RESEND_API_KEY not configured. Submission logged:');
    console.log(JSON.stringify(submission, null, 2));
    return true;
  }

  const emailBody = `
New Tool Submission

Tool Name: ${submission.toolName}
Description: ${submission.description || 'N/A'}
URL: ${submission.url}
Step: ${submission.step}
Substep: ${submission.substep}
${submission.instruction ? `Instruction: ${submission.instruction}` : 'No additional instructions'}
Submitter Email: ${submission.submitterEmail}

---
Submitted via AI-Enhanced Design Workflow
  `.trim();

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: 'thi@cloudflare.com',
        subject: `Tool Submission: ${submission.toolName}`,
        text: emailBody,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

async function handleSubmit(request, env) {
  try {
    const submission = await request.json();
    
    if (!submission.toolName || !submission.toolUrl || !submission.phaseNumber || !submission.sectionTitle || !submission.email) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (env.DB) {
      try {
        await env.DB.prepare(
          `INSERT INTO submitted_tools (
            name, url, description, icon, phase_number, phase_title, 
            section_title, use_case, submitted_by_name, submitted_by_email, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          submission.toolName,
          submission.toolUrl,
          submission.description || null,
          submission.icon || 'gemini',
          submission.phaseNumber,
          submission.phaseTitle,
          submission.sectionTitle,
          submission.useCase || null,
          submission.name || null,
          submission.email,
          'pending'
        ).run();
      } catch (dbError) {
        console.error('Database error:', dbError);
      }
    }

    const emailSubmission = {
      toolName: submission.toolName,
      description: submission.description,
      url: submission.toolUrl,
      step: submission.phaseTitle,
      substep: submission.sectionTitle,
      instruction: submission.useCase,
      submitterEmail: submission.email,
    };
    
    await sendEmail(env, emailSubmission);
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Submission received! You will be notified when it is reviewed.' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Invalid request',
      details: error.message 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// ===== ADMIN HANDLERS =====
async function getPendingSubmissions(env) {
  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'Database not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { results } = await env.DB.prepare(
      `SELECT * FROM submitted_tools 
       WHERE status = 'pending' 
       ORDER BY submitted_at DESC`
    ).all();

    return new Response(JSON.stringify({
      success: true,
      data: results,
      count: results.length,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to fetch submissions',
      details: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function getSubmissionStats(env) {
  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'Database not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { results: statusCounts } = await env.DB.prepare(
      `SELECT status, COUNT(*) as count FROM submitted_tools GROUP BY status`
    ).all();

    const { results: phaseCounts } = await env.DB.prepare(
      `SELECT phase_title, COUNT(*) as count 
       FROM submitted_tools 
       WHERE status = 'pending'
       GROUP BY phase_title`
    ).all();

    return new Response(JSON.stringify({
      success: true,
      data: {
        byStatus: statusCounts,
        byPhase: phaseCounts,
      },
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to fetch stats',
      details: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function approveSubmission(request, env) {
  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'Database not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { submissionId, adminPassword } = await request.json();

    if (adminPassword !== env.ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const submission = await env.DB.prepare(
      `SELECT * FROM submitted_tools WHERE id = ? AND status = 'pending'`
    ).bind(submissionId).first();

    if (!submission) {
      return new Response(JSON.stringify({ error: 'Submission not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await env.DB.prepare(
      `UPDATE submitted_tools 
       SET status = 'approved', reviewed_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).bind(submissionId).run();

    await env.DB.prepare(
      `INSERT INTO approved_tools (
        submission_id, name, url, description, icon, 
        phase_number, phase_title, section_title, use_case, 
        approved_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      submissionId,
      submission.name,
      submission.url,
      submission.description,
      submission.icon,
      submission.phase_number,
      submission.phase_title,
      submission.section_title,
      submission.use_case,
      'admin'
    ).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Submission approved',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to approve submission',
      details: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function rejectSubmission(request, env) {
  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'Database not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { submissionId, reason, adminPassword } = await request.json();

    if (adminPassword !== env.ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await env.DB.prepare(
      `UPDATE submitted_tools 
       SET status = 'rejected', 
           reviewed_at = CURRENT_TIMESTAMP,
           rejection_reason = ?
       WHERE id = ?`
    ).bind(reason || 'No reason provided', submissionId).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Submission rejected',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to reject submission',
      details: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Get all approved tools (includes static tools from homepage)
async function getAllApprovedTools(env) {
  const allTools = [];

  // First, add all static tools from phases
  phases.forEach(phase => {
    phase.sections.forEach(section => {
      section.tools.forEach(tool => {
        allTools.push({
          id: `static-${phase.number}-${section.title}-${tool.name}`,
          name: tool.name,
          url: tool.url,
          description: tool.description || '',
          icon: tool.icon,
          phase_number: phase.number,
          phase_title: phase.title,
          section_title: section.title,
          visible: 1,
          approved_at: null,
          source: 'static'
        });
      });
    });
  });

  // Then add approved tools from database
  if (env.DB) {
    try {
      const { results } = await env.DB.prepare(
        `SELECT * FROM approved_tools ORDER BY approved_at DESC`
      ).all();

      results.forEach(tool => {
        allTools.push({
          ...tool,
          source: 'submitted'
        });
      });
    } catch (error) {
      console.error('Error fetching approved tools:', error);
    }
  }

  return new Response(JSON.stringify({
    success: true,
    data: allTools,
    count: allTools.length,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Hide tool
async function hideToolById(request, env) {
  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'Database not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { toolId, adminPassword } = await request.json();

    if (adminPassword !== env.ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await env.DB.prepare(
      `UPDATE approved_tools SET visible = 0 WHERE id = ?`
    ).bind(toolId).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Tool hidden',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to hide tool',
      details: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Show tool
async function showToolById(request, env) {
  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'Database not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { toolId, adminPassword } = await request.json();

    if (adminPassword !== env.ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await env.DB.prepare(
      `UPDATE approved_tools SET visible = 1 WHERE id = ?`
    ).bind(toolId).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Tool shown',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to show tool',
      details: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Delete tool
async function deleteToolById(request, env) {
  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'Database not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { toolId, adminPassword } = await request.json();

    if (adminPassword !== env.ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await env.DB.prepare(
      `DELETE FROM approved_tools WHERE id = ?`
    ).bind(toolId).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Tool deleted',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to delete tool',
      details: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// ===== API ROUTES HANDLERS =====
async function handlePhases(request, env) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase();
  const icon = searchParams.get('icon');

  let mergedPhases = JSON.parse(JSON.stringify(phases));

  // Merge approved visible tools from database
  if (env.DB) {
    try {
      const { results } = await env.DB.prepare(
        `SELECT * FROM approved_tools WHERE visible = 1`
      ).all();

      results.forEach(tool => {
        const phase = mergedPhases.find(p => p.number === tool.phase_number);
        if (phase) {
          const section = phase.sections.find(s => s.title === tool.section_title);
          if (section) {
            section.tools.push({
              name: tool.name,
              icon: tool.icon,
              url: tool.url,
              description: tool.description || '',
            });
          }
        }
      });
    } catch (error) {
      console.error('Error fetching approved tools:', error);
    }
  }

  let filteredPhases = mergedPhases;

  if (search) {
    filteredPhases = mergedPhases.map(phase => ({
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

function handlePhaseById(request, id) {
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
    data: phase
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

function handleTools(request) {
  return new Response(JSON.stringify({
    success: true,
    data: [],
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

function handleToolByName(request, name) {
  return new Response(JSON.stringify({
    success: false,
    error: 'Tool not found'
  }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
}

function handleSearch(request) {
  return new Response(JSON.stringify({
    success: true,
    data: { phases: [], tools: [] },
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

function handleStats() {
  return new Response(JSON.stringify({
    success: true,
    data: { totalPhases: phases.length, totalTools: 0 },
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

function handleSections(request) {
  return new Response(JSON.stringify({
    success: true,
    data: [],
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

function handleHealth() {
  return new Response(JSON.stringify({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// ===== MAIN WORKER =====
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    if (url.pathname.startsWith('/api/')) {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
      }

      if (url.pathname === '/api/health') return handleHealth();
      if (url.pathname === '/api/stats') return handleStats();
      if (url.pathname === '/api/search') return handleSearch(request);
      if (url.pathname === '/api/sections') return handleSections(request);
      if (url.pathname === '/api/phases') return handlePhases(request, env);
      
      const phaseMatch = url.pathname.match(/^\/api\/phases\/(\d+)$/);
      if (phaseMatch) return handlePhaseById(request, phaseMatch[1]);

      if (url.pathname === '/api/tools') return handleTools(request);
      
      const toolMatch = url.pathname.match(/^\/api\/tools\/(.+)$/);
      if (toolMatch) return handleToolByName(request, toolMatch[1]);

      if (url.pathname === '/api/submit' && request.method === 'POST') {
        return handleSubmit(request, env);
      }

      if (url.pathname === '/api/admin/submissions' && request.method === 'GET') {
        return getPendingSubmissions(env);
      }

      if (url.pathname === '/api/admin/stats' && request.method === 'GET') {
        return getSubmissionStats(env);
      }

      if (url.pathname === '/api/admin/approve' && request.method === 'POST') {
        return approveSubmission(request, env);
      }

      if (url.pathname === '/api/admin/reject' && request.method === 'POST') {
        return rejectSubmission(request, env);
      }

      if (url.pathname === '/api/admin/tools' && request.method === 'GET') {
        return getAllApprovedTools(env);
      }

      if (url.pathname === '/api/admin/tools/hide' && request.method === 'POST') {
        return hideToolById(request, env);
      }

      if (url.pathname === '/api/admin/tools/show' && request.method === 'POST') {
        return showToolById(request, env);
      }

      if (url.pathname === '/api/admin/tools/delete' && request.method === 'POST') {
        return deleteToolById(request, env);
      }

      return new Response(JSON.stringify({ error: 'Not Found' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const response = await env.ASSETS.fetch(request);
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers),
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    });
  },
};
