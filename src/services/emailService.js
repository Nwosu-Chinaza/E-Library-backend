import nodemailer from "nodemailer";
import env from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.warn("Nodemailer configuration error:", error.message);
  } else {
    console.log("Nodemailer is ready to send emails.");
  }
});

/**
 * Send an email
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"E-Library" <${env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    return info;
  } catch (error) {
    console.error("Email Service Error:", error);
    throw error;
  }
};

export const testEmail = async () => {
  return sendEmail({
    to: env.EMAIL_USER, // Send to self for testing
    subject: "E-Library Email Test",
    html: `
      <h2>E-Library Email Test</h2>
      <p>If you received this email, Nodemailer is working correctly.</p>
    `,
  });
};