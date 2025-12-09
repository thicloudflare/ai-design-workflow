import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Email configuration
    const recipientEmail = 'thi@cloudflare.com';
    
    // Format email content
    const emailContent = `
New Tool Submission
===================

Tool Name: ${data.toolName}
URL: ${data.url}
Step: ${data.step}
Substep: ${data.substep}

Description:
${data.description || 'N/A'}

Optional Instruction:
${data.instruction || 'N/A'}

Submitted by: ${data.submitterEmail}
    `.trim();

    // For Cloudflare Workers, we'll use a simple email service
    // You can integrate with Resend, SendGrid, or Cloudflare Email Routing
    
    // Using Resend API (recommended for Cloudflare Workers)
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      // Return success anyway but log the issue
      return NextResponse.json({ 
        success: true, 
        message: 'Submission received (email not configured)' 
      });
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'AI Design Workflow <onboarding@resend.dev>', // Update with your domain
        to: [recipientEmail],
        subject: `New Tool Submission: ${data.toolName}`,
        text: emailContent,
        html: `
          <div style="font-family: monospace; color: #1a1a2e; padding: 20px;">
            <h2 style="color: #FFA60C;">New Tool Submission</h2>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Tool Name:</strong> ${data.toolName}</p>
              <p><strong>URL:</strong> <a href="${data.url}" style="color: #FFA60C;">${data.url}</a></p>
              <p><strong>Step:</strong> ${data.step}</p>
              <p><strong>Substep:</strong> ${data.substep}</p>
            </div>
            <div style="margin: 20px 0;">
              <p><strong>Description:</strong></p>
              <p style="white-space: pre-wrap;">${data.description || 'N/A'}</p>
            </div>
            <div style="margin: 20px 0;">
              <p><strong>Optional Instruction:</strong></p>
              <p style="white-space: pre-wrap;">${data.instruction || 'N/A'}</p>
            </div>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p><strong>Submitted by:</strong> ${data.submitterEmail}</p>
            </div>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const error = await emailResponse.json();
      console.error('Resend API error:', error);
      throw new Error('Failed to send email');
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Tool submitted successfully' 
    });
    
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit tool' },
      { status: 500 }
    );
  }
}
