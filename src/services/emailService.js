import { Resend } from "resend";
import env from "../config/env.js";

const resend = new Resend(env.RESEND_API_KEY);

/**
 * Send an email
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: env.FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Email Service Error:", error);
    throw error;
  }
};

export const testEmail = async () => {
  return sendEmail({
    to: "nwosuchinazaubadimma@gmail.com",
    subject: "E-Library Email Test",
    html: `
      <h2>E-Library Email Test</h2>
      <p>If you received this email, Resend is working correctly.</p>
    `,
  });
};