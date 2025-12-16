/**
 * Simple API handler for tool submission
 * Sends email notification to thi@cloudflare.com
 */

// Send email via Resend
async function sendEmail(env, submission) {
  // If no API key is configured, just log and return success (for testing)
  if (!env.RESEND_API_KEY) {
    console.log('⚠️ RESEND_API_KEY not configured. Submission logged:');
    console.log(JSON.stringify(submission, null, 2));
    return true; // Return success for testing
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
        from: 'onboarding@resend.dev', // Use verified domain in production
        to: 'thi@cloudflare.com',
        subject: `Tool Submission: ${submission.toolName}`,
        text: emailBody,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #FFA60C;">New Tool Submission</h2>
            <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
              <tr style="background-color: #f5f5f5;">
                <td style="padding: 12px; font-weight: bold; border: 1px solid #ddd;">Tool Name</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${submission.toolName}</td>
              </tr>
              <tr>
                <td style="padding: 12px; font-weight: bold; border: 1px solid #ddd;">Description</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${submission.description || 'N/A'}</td>
              </tr>
              <tr style="background-color: #f5f5f5;">
                <td style="padding: 12px; font-weight: bold; border: 1px solid #ddd;">URL</td>
                <td style="padding: 12px; border: 1px solid #ddd;"><a href="${submission.url}">${submission.url}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px; font-weight: bold; border: 1px solid #ddd;">Step</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${submission.step}</td>
              </tr>
              <tr style="background-color: #f5f5f5;">
                <td style="padding: 12px; font-weight: bold; border: 1px solid #ddd;">Substep</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${submission.substep}</td>
              </tr>
              ${submission.instruction ? `<tr>
                <td style="padding: 12px; font-weight: bold; border: 1px solid #ddd;">Instruction</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${submission.instruction}</td>
              </tr>` : ''}
              <tr style="background-color: #f5f5f5;">
                <td style="padding: 12px; font-weight: bold; border: 1px solid #ddd;">Submitter Email</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${submission.submitterEmail}</td>
              </tr>
            </table>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              You can manually add this tool to the workflow when ready.
            </p>
          </div>
        `,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Handle POST /api/submit
export async function handleSubmit(request, env) {
  try {
    const submission = await request.json();
    
    // Validate required fields
    if (!submission.toolName || !submission.toolUrl || !submission.phaseNumber || !submission.sectionTitle || !submission.email) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Save to D1 database
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
        // Continue to send email even if DB fails
      }
    }

    // Send email notification (keep existing functionality)
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
