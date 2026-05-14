import "server-only";

import { createAuth } from "@repo/auth/server";
import {
  sendInvitationEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "@repo/email";
import { database } from "./db";

export const auth = createAuth({
  database: { db: database, type: "postgres" },
  sendVerificationEmail: async ({ user, url }) => {
    await sendVerificationEmail({
      to: user.email,
      name: user.name,
      verificationUrl: url,
    });
  },
  sendPasswordResetEmail: async ({ user, url }) => {
    await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetUrl: url,
    });
  },
  sendInvitationEmail: async (params) => {
    await sendInvitationEmail({
      to: params.email,
      inviterName: params.inviterName,
      organizationName: params.organizationName,
      inviteUrl: params.inviteUrl,
      role: params.role,
    });
  },
});
