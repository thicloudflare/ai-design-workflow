/**
 * API handlers for tool submission and approval
 */

// Generate a random approval token
function generateToken() {
  return crypto.randomUUID();
}

// Send email via Cloudflare Email Workers or external service
async function sendEmail(env, submission) {
  const approvalToken = generateToken();
  const approvalUrl = `https://ai-design-workflow.thi-s-ent-account.workers.dev/api/approve?token=${approvalToken}`;
  
  // Store pending submission in KV
  await env.SUBMISSIONS.put(
    `pending:${approvalToken}`,
    JSON.stringify(submission),
    { expirationTtl: 60 * 60 * 24 * 30 } // 30 days
  );

  const emailBody = `
New Tool Submission

Tool Name: ${submission.toolName}
Description: ${submission.description}
URL: ${submission.url}
Step: ${submission.step}
Substep: ${submission.substep}
${submission.instruction ? `Instruction: ${submission.instruction}` : ''}
Submitter Email: ${submission.submitterEmail}

---
Click to approve and add to the site:
${approvalUrl}

This link will expire in 30 days.
  `.trim();

  // Use Resend API or Mailgun for sending emails
  // For this example, I'll use a fetch to an email service
  // You'll need to configure this with your email service API key
  
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'noreply@ai-design-workflow.pages.dev',
      to: 'thi@cloudflare.com',
      subject: `Tool Submission: ${submission.toolName}`,
      text: emailBody,
      html: `
        <h2>New Tool Submission</h2>
        <table style="border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px; font-weight: bold;">Tool Name:</td><td style="padding: 8px;">${submission.toolName}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Description:</td><td style="padding: 8px;">${submission.description}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">URL:</td><td style="padding: 8px;"><a href="${submission.url}">${submission.url}</a></td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Step:</td><td style="padding: 8px;">${submission.step}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Substep:</td><td style="padding: 8px;">${submission.substep}</td></tr>
          ${submission.instruction ? `<tr><td style="padding: 8px; font-weight: bold;">Instruction:</td><td style="padding: 8px;">${submission.instruction}</td></tr>` : ''}
          <tr><td style="padding: 8px; font-weight: bold;">Submitter:</td><td style="padding: 8px;">${submission.submitterEmail}</td></tr>
        </table>
        <p style="margin: 30px 0;">
          <a href="${approvalUrl}" style="background-color: #FFA60C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            ✓ Approve & Add to Site
          </a>
        </p>
        <p style="color: #666; font-size: 12px;">This link will expire in 30 days.</p>
      `,
    }),
  });

  return response.ok;
}

// Handle POST /api/submit
export async function handleSubmit(request, env) {
  try {
    const submission = await request.json();
    
    // Validate required fields
    if (!submission.toolName || !submission.url || !submission.step || !submission.substep || !submission.submitterEmail) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send email
    const emailSent = await sendEmail(env, submission);
    
    if (emailSent) {
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Submission received! You will be notified once it is approved.' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ 
        error: 'Failed to send email. Please try again.' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
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

// Handle GET /api/approve?token=xxx
export async function handleApprove(request, env) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  
  if (!token) {
    return new Response('Missing approval token', { status: 400 });
  }

  // Get pending submission from KV
  const pendingData = await env.SUBMISSIONS.get(`pending:${token}`);
  
  if (!pendingData) {
    return new Response('Invalid or expired approval link', { status: 404 });
  }

  const submission = JSON.parse(pendingData);
  
  // Store approved submission
  const toolId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  await env.SUBMISSIONS.put(
    `approved:${toolId}`,
    JSON.stringify({
      ...submission,
      approvedAt: new Date().toISOString(),
      id: toolId,
    })
  );

  // Delete pending submission
  await env.SUBMISSIONS.delete(`pending:${token}`);

  // Return success page
  return new Response(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Tool Approved</title>
        <style>
          body {
            font-family: 'Source Sans 3', sans-serif;
            background-color: #0A1628;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
          }
          .container {
            text-align: center;
            max-width: 500px;
          }
          h1 { color: #FFA60C; }
          a {
            display: inline-block;
            margin-top: 20px;
            background-color: #FFA60C;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
          }
          a:hover { background-color: #ff8c00; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>✓ Tool Approved!</h1>
          <p><strong>${submission.toolName}</strong> has been successfully added to the AI-Enhanced Design Workflow.</p>
          <p>It will appear in the <strong>${submission.step}</strong> phase under <strong>${submission.substep}</strong>.</p>
          <a href="/">View Site</a>
        </div>
      </body>
    </html>
  `, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
}

// Handle GET /api/tools - Get all approved tools
export async function handleGetTools(env) {
  const tools = [];
  const list = await env.SUBMISSIONS.list({ prefix: 'approved:' });
  
  for (const key of list.keys) {
    const data = await env.SUBMISSIONS.get(key.name);
    if (data) {
      tools.push(JSON.parse(data));
    }
  }

  return new Response(JSON.stringify(tools), {
    status: 200,
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
