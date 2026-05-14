import { render } from "@react-email/components";
import { Resend } from "resend";
import { InvitationEmail } from "./templates/invitation";
import { ResetPassword } from "./templates/reset-password";
import { VerifyEmail } from "./templates/verify-email";

// Placeholder satisfies Resend's constructor during `next build`, when
// RESEND_TOKEN is not yet present. At runtime in deployed environments the
// real env var is set; if it somehow isn't, the actual send call fails with
// an auth error rather than blocking the build.
export const resend = new Resend(
  process.env.RESEND_TOKEN ?? "re_build_placeholder"
);

export * from "./templates/contact";
export * from "./templates/invitation";
export * from "./templates/reset-password";
export * from "./templates/verify-email";

// Email sending helpers
export const sendVerificationEmail = async ({
  to,
  name,
  verificationUrl,
}: {
  to: string;
  name: string;
  verificationUrl: string;
}) => {
  const emailHtml = await render(
    VerifyEmail({
      name,
      verificationUrl,
    })
  );

  await resend.emails.send({
    from: process.env.RESEND_FROM || "noreply@example.com",
    to,
    subject: "Verify your email address",
    html: emailHtml,
  });
};

export const sendPasswordResetEmail = async ({
  to,
  name,
  resetUrl,
}: {
  to: string;
  name: string;
  resetUrl: string;
}) => {
  const emailHtml = await render(
    ResetPassword({
      name,
      resetUrl,
    })
  );

  await resend.emails.send({
    from: process.env.RESEND_FROM || "noreply@example.com",
    to,
    subject: "Reset your password",
    html: emailHtml,
  });
};

export const sendInvitationEmail = async ({
  to,
  inviterName,
  organizationName,
  inviteUrl,
  role,
}: {
  to: string;
  inviterName: string;
  organizationName: string;
  inviteUrl: string;
  role: string;
}) => {
  const emailHtml = await render(
    InvitationEmail({
      inviterName,
      organizationName,
      inviteUrl,
      role,
    })
  );

  await resend.emails.send({
    from: process.env.RESEND_FROM || "noreply@example.com",
    to,
    subject: `You're invited to join ${organizationName}`,
    html: emailHtml,
  });
};
