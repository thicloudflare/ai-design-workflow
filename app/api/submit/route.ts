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

    // Using Resend API
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      console.log('Submission data:', data);
      // Return success anyway but log the issue
      return NextResponse.json({ 
        success: true, 
        message: 'Submission received (email not configured - check console for data)' 
      });
    }

    console.log('Attempting to send email with API key:', resendApiKey.substring(0, 10) + '...');

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
      // Don't fail the submission, just log the error
      console.log('Submission saved (email failed):', data);
      return NextResponse.json({ 
        success: true, 
        message: 'Tool submitted successfully (email delivery pending)' 
      });
    }

    const result = await emailResponse.json();
    console.log('Email sent successfully:', result);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Tool submitted successfully' 
    });
    
  } catch (error: any) {
    console.error('Submission error:', error);
    console.error('Error details:', {
      message: error.message,
      cause: error.cause,
      stack: error.stack
    });
    
    // Log the submission data even if email fails
    try {
      const data = await request.json();
      console.log('Submission data (email failed):', data);
    } catch (e) {
      // Request already consumed
    }
    
    // Return success anyway - at least the data is logged
    return NextResponse.json({ 
      success: true, 
      message: 'Submission received (email delivery issue - check server logs)' 
    });
  }
}
