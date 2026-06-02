import { NextResponse } from "next/server"
import { Resend } from "resend"



const resend = new Resend(process.env.RESEND_API_KEY)

// Optional reCAPTCHA verification - returns true if verification passes OR if reCAPTCHA is unavailable
async function verifyRecaptchaOptional(token: string | null, action: string) {
    // If no token provided, still allow submission (reCAPTCHA might be down)
    if (!token) {
        console.warn("No reCAPTCHA token provided - allowing submission without verification")
        return true
    }

    try {
        const response = await fetch(
            `https://recaptchaenterprise.googleapis.com/v1/projects/monsoonbooks/assessments?key=${process.env.RECAPTCHA_SECRET_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    event: {
                        token: token,
                        expectedAction: action,
                        siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
                    },
                }),
            }
        )

        // If the API call fails, still allow submission
        if (!response.ok) {
            console.warn("reCAPTCHA API call failed - allowing submission")
            return true
        }

        const data = await response.json()

        // Check if verification was successful
        const isValid = data.tokenProperties?.valid === true
        const riskScore = data.riskAnalysis?.score || 0

        // Log suspicious activity but still allow if score is low
        if (!isValid) {
            console.warn("Invalid reCAPTCHA token - but allowing submission")
        }

        if (riskScore < 0.5) {
            console.warn(`Low reCAPTCHA score: ${riskScore} - but still allowing submission`)
        }

        // Always return true to not block legitimate users
        return true
    } catch (error) {
        console.error("reCAPTCHA verification error:", error)
        // If there's any error (network, API down, etc.), still allow the submission
        return true
    }
}

export async function POST(req: Request) {
    try {
        const { name, email, subject, message, recaptchaToken } = await req.json()

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Please enter a valid email address" },
                { status: 400 }
            )
        }

        // Verify reCAPTCHA (optional - always returns true even if it fails)
        await verifyRecaptchaOptional(recaptchaToken, "CONTACT_FORM")

        // Send email to admin
        await resend.emails.send({
            from: "Monsoon Books <noreply@monsoonbooks.com.np>",
            to: "info@monsoonbooks.com.np",
            replyTo: email,
            subject: `Contact Form: ${subject}`,
            html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Contact Form Submission</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                line-height: 1.6;
                color: #1e293b;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: #c10617;
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 8px 8px 0 0;
              }
              .content {
                background: #ffffff;
                padding: 30px;
                border: 1px solid #e2e8f0;
                border-top: none;
                border-radius: 0 0 8px 8px;
              }
              .field {
                margin-bottom: 20px;
                padding-bottom: 20px;
                border-bottom: 1px solid #e2e8f0;
              }
              .field-label {
                font-weight: bold;
                color: #0f172a;
                margin-bottom: 8px;
              }
              .field-value {
                color: #475569;
                margin-top: 5px;
              }
              .recaptcha-note {
                background: #fef3c7;
                padding: 10px;
                border-radius: 6px;
                font-size: 12px;
                color: #92400e;
                margin-top: 20px;
              }
              .footer {
                text-align: center;
                padding: 20px;
                font-size: 12px;
                color: #64748b;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>New Contact Form Submission</h1>
              </div>
              <div class="content">
                <div class="field">
                  <div class="field-label">Name:</div>
                  <div class="field-value">${name}</div>
                </div>
                
                <div class="field">
                  <div class="field-label">Email:</div>
                  <div class="field-value">${email}</div>
                </div>
                
                <div class="field">
                  <div class="field-label">Subject:</div>
                  <div class="field-value">${subject}</div>
                </div>
                
                <div class="field">
                  <div class="field-label">Message:</div>
                  <div class="field-value" style="white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</div>
                </div>

                ${!recaptchaToken ? `
                  <div class="recaptcha-note">
                    ⚠️ Note: This submission was made without reCAPTCHA verification (reCAPTCHA may have been unavailable).
                  </div>
                ` : ''}
              </div>
              <div class="footer">
                <p>This message was sent from the contact form on Monsoon Books website.</p>
              </div>
            </div>
          </body>
        </html>
      `,
        })

        // Send auto-reply to customer (only if we have a valid email)
        try {
            await resend.emails.send({
                from: "Monsoon Books <info@monsoonbooks.com.np>",
                to: email,
                subject: "Thank you for contacting Monsoon Books",
                html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Thank You for Contacting Us</title>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                  line-height: 1.6;
                  color: #1e293b;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  background: #c10617;
                  color: white;
                  padding: 30px;
                  text-align: center;
                  border-radius: 8px 8px 0 0;
                }
                .content {
                  background: #ffffff;
                  padding: 30px;
                  border: 1px solid #e2e8f0;
                  border-top: none;
                  border-radius: 0 0 8px 8px;
                }
                .button {
                  display: inline-block;
                  padding: 12px 24px;
                  background-color: #c10617;
                  color: white;
                  text-decoration: none;
                  border-radius: 6px;
                  margin: 20px 0;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Thank You, ${name}!</h1>
                </div>
                <div class="content">
                  <p>We have received your message and will get back to you within 24-48 hours.</p>
                  
                  <p>Here's a copy of your message:</p>
                  <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin: 15px 0;">
                    <strong>Subject:</strong> ${subject}<br/><br/>
                    <strong>Message:</strong><br/>
                    ${message.replace(/\n/g, '<br>')}
                  </div>
                  
                  <p>In the meantime, you might be interested in:</p>
                  <ul>
                    <li>📚 <a href="https://monsoonbooks.com.np/books" style="color: #c10617;">Browse our latest collection</a></li>
                    <li>✨ <a href="https://monsoonbooks.com.np/bestsellers" style="color: #c10617;">Check out our bestsellers</a></li>
                    <li>🎉 <a href="https://monsoonbooks.com.np/offers" style="color: #c10617;">View current offers</a></li>
                  </ul>
                  
                  <div style="text-align: center;">
                    <a href="https://monsoonbooks.com.np/books" class="button">Start Exploring →</a>
                  </div>
                  
                  <p>Best regards,<br>
                  <strong>The Monsoon Books Team</strong></p>
                </div>
              </div>
            </body>
          </html>
        `,
            })
        } catch (autoReplyError) {
            // Don't fail the whole request if auto-reply fails
            console.error("Failed to send auto-reply:", autoReplyError)
        }

        return NextResponse.json({
            success: true,
            message: "Message sent successfully",
        })
    } catch (error) {
        console.error("Contact form error:", error)
        return NextResponse.json(
            { error: "Failed to send message. Please try again later." },
            { status: 500 }
        )
    }
}