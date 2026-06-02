import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Please enter a valid email address" },
                { status: 400 }
            );
        }

        // Check if already subscribed
        const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
            where: { email },
        });

        if (existingSubscriber) {
            return NextResponse.json(
                { error: "This email is already subscribed" },
                { status: 400 }
            );
        }


        const normalizedEmail = email.trim().toLowerCase();
        // Create subscriber
        const subscriber = await prisma.newsletterSubscriber.create({
            data: { email: normalizedEmail },
        });

        console.log("Sending welcome email to:", email);

        // Send welcome email
        try {
            await resend.emails.send({
                from: "Monsoon Books <no-reply@monsoonbooks.com.np>",
                to: normalizedEmail,
                subject: "Welcome to Monsoon Books Newsletter! 📚",
                html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Welcome to Monsoon Books</title>
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
                  text-align: center;
                  padding: 30px 0;
                  border-bottom: 3px solid #c10617;
                }
                .logo {
                  font-size: 28px;
                  font-weight: 900;
                  color: #c10617;
                }
                .content {
                  padding: 30px 20px;
                  background: #ffffff;
                }
                .button {
                  display: inline-block;
                  padding: 12px 24px;
                  background-color: #c10617;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 8px;
                  margin: 20px 0;
                }
                .footer {
                  text-align: center;
                  padding: 20px;
                  font-size: 12px;
                  color: #64748b;
                  border-top: 1px solid #e2e8f0;
                }
                h1 {
                  color: #0f172a;
                  font-size: 24px;
                  margin-bottom: 20px;
                }
                .highlight {
                  color: #c10617;
                  font-weight: bold;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <span class="logo">Monsoon Books</span>
                </div>
                <div class="content">
                  <h1>Welcome to the Monsoon Books family! 🎉</h1>
                  <p>Dear book lover,</p>
                  <p>Thank you for subscribing to our newsletter! You've just taken the first step into a world of endless stories, knowledge, and imagination.</p>
                  
                  <p>As a subscriber, you'll receive:</p>
                  <ul>
                    <li>📚 <span class="highlight">Exclusive book recommendations</span> tailored to your interests</li>
                    <li>🎉 <span class="highlight">Special discounts</span> and early access to sales</li>
                    <li>✨ <span class="highlight">Author interviews</span> and behind-the-scenes content</li>
                    <li>📖 <span class="highlight">New release alerts</span> for your favorite genres</li>
                  </ul>
                  
                  <div style="text-align: center;">
                    <a href="https://monsoonbooks.com.np/books" class="button">Start Exploring →</a>
                  </div>
                  
                  <p>We're thrilled to have you with us on this literary journey. Get ready to discover your next favorite book!</p>
                  
                  <p>Happy reading!<br>
                  <strong>The Monsoon Books Team</strong></p>
                </div>
                <div class="footer">
                  <p>© 2026 Monsoon Books. All rights reserved.</p>
                  <p>
                    <a href="https://monsoonbooks.com.np/privacy" style="color: #64748b; text-decoration: none;">Privacy Policy</a> | 
                    <a href="https://monsoonbooks.com.np/unsubscribe" style="color: #64748b; text-decoration: none;">Unsubscribe</a>
                  </p>
                  <p>You received this email because you subscribed to our newsletter.</p>
                </div>
              </div>
            </body>
          </html>
        `,
            });
        } catch (emailError) {
            console.error("Failed to send welcome email:", emailError);
            // Don't fail the subscription if email fails
        }

        return NextResponse.json({
            success: true,
            message: "Successfully subscribed!",
            subscriber,
        });
    } catch (error) {
        console.error("Newsletter subscription error:", error);
        return NextResponse.json(
            { error: "Failed to subscribe. Please try again later." },
            { status: 500 }
        );
    }
}