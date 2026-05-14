import { adminClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const authClient: any = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [adminClient(), organizationClient({ teams: { enabled: true } })],
});

export const { signIn, signOut, signUp, useSession } = authClient;
export const organization = authClient.organization;

// Export additional auth methods
export const sendVerificationEmail = authClient.sendVerificationEmail;
export const forgetPassword = authClient.forgetPassword;
export const resetPassword = authClient.resetPassword;
