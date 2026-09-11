import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

// ─── Build transporter ───────────────────────────────────────────────────────
const hasSmtp = !!(env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER);

const transporter = hasSmtp
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    })
  : null;

/**
 * Internal send helper.
 * In dev (no SMTP configured), logs to console instead of sending real email.
 */
const sendMail = async ({ to, subject, html }) => {
  if (!transporter) {
    logger.info(
      `\n📧  [DEV EMAIL — not sent]\n` +
        `   To:      ${to}\n` +
        `   Subject: ${subject}\n` +
        `   Body:    ${html.replace(/<[^>]+>/g, "")}\n`
    );
    return;
  }
  await transporter.sendMail({ from: env.SMTP_FROM, to, subject, html });
};

// ─── Public helpers ───────────────────────────────────────────────────────────

export const sendPasswordReset = (email, resetUrl) =>
  sendMail({
    to: email,
    subject: "Reset your CollabIDE password",
    html: `
      <p>You requested a password reset.</p>
      <p><a href="${resetUrl}">Reset your password</a></p>
      <p>This link expires in 30 minutes. If you didn't request this, ignore this email.</p>
    `,
  });

export const sendVerification = (email, verifyUrl) =>
  sendMail({
    to: email,
    subject: "Verify your CollabIDE email",
    html: `
      <p>Welcome to CollabIDE! Please verify your email address.</p>
      <p><a href="${verifyUrl}">Verify email</a></p>
    `,
  });

export const sendInvitation = (email, workspaceName, inviteUrl) =>
  sendMail({
    to: email,
    subject: `You've been invited to ${workspaceName} on CollabIDE`,
    html: `
      <p>You've been invited to join the workspace <strong>${workspaceName}</strong>.</p>
      <p><a href="${inviteUrl}">Accept invitation</a></p>
    `,
  });
