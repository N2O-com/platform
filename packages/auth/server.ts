import "server-only";

import { type BetterAuthOptions, betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { admin, organization } from "better-auth/plugins";
import { headers } from "next/headers";

type EmailParams = { user: { email: string; name: string }; url: string };

type InvitationEmailParams = {
  email: string;
  inviterName: string;
  organizationName: string;
  inviteUrl: string;
  role: string;
};

export type AuthConfig = {
  database: BetterAuthOptions["database"];
  secret?: string;
  baseURL?: string;
  sendVerificationEmail: (params: EmailParams) => Promise<void>;
  sendPasswordResetEmail: (params: EmailParams) => Promise<void>;
  sendInvitationEmail: (params: InvitationEmailParams) => Promise<void>;
};

export const createAuth = (config: AuthConfig) => {
  const baseURL = config.baseURL ?? process.env.NEXT_PUBLIC_APP_URL;
  return betterAuth({
    database: config.database,
    secret: config.secret ?? process.env.BETTER_AUTH_SECRET,
    baseURL,
    session: {
      cookieCache: { enabled: true, maxAge: 5 * 60 },
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: async ({ user, url }) => {
        await config.sendPasswordResetEmail({ user, url });
      },
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        await config.sendVerificationEmail({ user, url });
      },
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
    },
    plugins: [
      nextCookies(),
      admin(),
      organization({
        teams: { enabled: true },
        sendInvitationEmail: async (data) => {
          const inviteUrl = `${baseURL}/accept-invitation/${data.id}`;
          await config.sendInvitationEmail({
            email: data.email,
            inviterName: data.inviter.user.name,
            organizationName: data.organization.name,
            inviteUrl,
            role: data.role,
          });
        },
      }),
    ],
  });
};

export type Auth = ReturnType<typeof createAuth>;

export const getCurrentUser = async (auth: Auth) => {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  return session?.user ?? null;
};

export const getCurrentSession = async (auth: Auth) => {
  const h = await headers();
  return auth.api.getSession({ headers: h });
};
