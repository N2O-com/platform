import { render } from "@react-email/components";
import { Resend } from "resend";
import { InvitationEmail } from "./templates/invitation";
import { ResetPassword } from "./templates/reset-password";
import { VerifyEmail } from "./templates/verify-email";

// Resend's constructor validates RESEND_TOKEN synchronously, so construction is
// deferred until first property access. Unlike `@repo/database`, there is no
// upstream hook to defer key resolution inside the SDK itself, so a thin Proxy
// is the equivalent root-cause containment.
let _resend: Resend | undefined;

export const resend = new Proxy({} as Resend, {
  get: (_target, prop) => {
    if (!_resend) {
      _resend = new Resend(process.env.RESEND_TOKEN);
    }
    return Reflect.get(_resend, prop);
  },
});

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
