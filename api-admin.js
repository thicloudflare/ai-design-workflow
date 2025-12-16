/**
 * Admin API handlers for tool submission management
 */

// Get all pending submissions
export async function getPendingSubmissions(env) {
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

// Get submission statistics
export async function getSubmissionStats(env) {
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

// Approve a submission and create GitHub PR
export async function approveSubmission(request, env) {
  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'Database not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { submissionId, adminPassword } = await request.json();

    // Simple password check (use env.ADMIN_PASSWORD in production)
    if (adminPassword !== env.ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get submission details
    const submission = await env.DB.prepare(
      `SELECT * FROM submitted_tools WHERE id = ? AND status = 'pending'`
    ).bind(submissionId).first();

    if (!submission) {
      return new Response(JSON.stringify({ error: 'Submission not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create GitHub PR (if GITHUB_TOKEN is configured)
    let prUrl = null;
    let prNumber = null;

    if (env.GITHUB_TOKEN) {
      try {
        const prResult = await createGitHubPR(env, submission);
        prUrl = prResult.url;
        prNumber = prResult.number;
      } catch (prError) {
        console.error('Failed to create PR:', prError);
        // Continue with approval even if PR fails
      }
    }

    // Update submission status
    await env.DB.prepare(
      `UPDATE submitted_tools 
       SET status = 'approved', reviewed_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).bind(submissionId).run();

    // Log to approved_tools table
    await env.DB.prepare(
      `INSERT INTO approved_tools (
        submission_id, name, url, description, icon, 
        phase_number, phase_title, section_title, use_case, 
        pr_url, pr_number, approved_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
      prUrl,
      prNumber,
      'admin'
    ).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Submission approved',
      prUrl,
      prNumber,
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

// Reject a submission
export async function rejectSubmission(request, env) {
  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'Database not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { submissionId, reason, adminPassword } = await request.json();

    // Simple password check
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

// Create GitHub Pull Request
async function createGitHubPR(env, submission) {
  const owner = 'thicloudflare';
  const repo = 'ai-design-workflow';
  const branchName = `add-tool-${submission.id}-${Date.now()}`;

  // Get current phases.ts content
  const getFileResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/data/phases.ts`,
    {
      headers: {
        'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ai-design-workflow',
      },
    }
  );

  if (!getFileResponse.ok) {
    throw new Error('Failed to fetch phases.ts from GitHub');
  }

  const fileData = await getFileResponse.json();
  const currentContent = atob(fileData.content);

  // Generate new tool entry
  const newToolEntry = `          {
            name: "${submission.name.replace(/"/g, '\\"')}",
            icon: "${submission.icon}",
            url: "${submission.url}",
            description: "${(submission.description || '').replace(/"/g, '\\"')}",
          },`;

  // Find the section and add the tool
  // This is a simplified version - you might want more sophisticated parsing
  const updatedContent = addToolToSection(currentContent, submission.phase_number, submission.section_title, newToolEntry);

  // Get the default branch SHA
  const refResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/main`,
    {
      headers: {
        'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ai-design-workflow',
      },
    }
  );

  const refData = await refResponse.json();
  const baseSha = refData.object.sha;

  // Create new branch
  await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/refs`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ai-design-workflow',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref: `refs/heads/${branchName}`,
        sha: baseSha,
      }),
    }
  );

  // Update file on new branch
  await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/data/phases.ts`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ai-design-workflow',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Add tool: ${submission.name}`,
        content: btoa(updatedContent),
        sha: fileData.sha,
        branch: branchName,
      }),
    }
  );

  // Create pull request
  const prResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ai-design-workflow',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `Add tool: ${submission.name}`,
        head: branchName,
        base: 'main',
        body: `## New Tool Submission

**Tool:** ${submission.name}
**URL:** ${submission.url}
**Phase:** ${submission.phase_title}
**Section:** ${submission.section_title}

**Description:**
${submission.description || 'No description provided'}

**Submitted by:** ${submission.submitted_by_email}

---
_Auto-generated from submission #${submission.id}_`,
      }),
    }
  );

  const prData = await prResponse.json();

  return {
    url: prData.html_url,
    number: prData.number,
  };
}

// Helper to add tool to specific section
function addToolToSection(content, phaseNumber, sectionTitle, newToolEntry) {
  // This is a simplified implementation
  // In production, you'd want more robust parsing
  const lines = content.split('\n');
  let inTargetPhase = false;
  let inTargetSection = false;
  let insertIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if we're in the target phase
    if (line.includes(`number: ${phaseNumber},`)) {
      inTargetPhase = true;
    }

    // Check if we're in the target section
    if (inTargetPhase && line.includes(`title: "${sectionTitle}"`)) {
      inTargetSection = true;
    }

    // Find the tools array in the target section
    if (inTargetSection && line.includes('tools: [')) {
      // Find the closing bracket of the tools array
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].trim() === '],') {
          insertIndex = j;
          break;
        }
      }
      break;
    }
  }

  if (insertIndex > 0) {
    lines.splice(insertIndex, 0, newToolEntry);
  }

  return lines.join('\n');
}
