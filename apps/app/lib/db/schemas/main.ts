import type {
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from "@repo/database";

export interface Database {
  user: UserTable;
  session: SessionTable;
  account: AccountTable;
  verification: VerificationTable;
  audit_log: AuditLogTable;
  organization: OrganizationTable;
  member: MemberTable;
  invitation: InvitationTable;
  team: TeamTable;
}

export interface UserTable {
  id: Generated<string>;
  name: string;
  username: string | null;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: "admin" | "user" | null;
  communications: boolean | null;
  banned: boolean;
  banReason: string | null;
  banExpires: Date | null;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

export interface SessionTable {
  id: Generated<string>;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

export interface AccountTable {
  id: Generated<string>;
  userId: string;
  accountId: string;
  providerId: string;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: Date | null;
  refreshTokenExpiresAt: Date | null;
  scope: string | null;
  idToken: string | null;
  password: string | null;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

export interface VerificationTable {
  id: Generated<string>;
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

export interface AuditLogTable {
  id: Generated<string>;
  userId: string;
  action: string;
  resourceType: string | null;
  resourceId: string | null;
  details: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  sessionId: string | null;
  success: boolean;
  errorMessage: string | null;
  createdAt: Generated<Date>;
}

export interface OrganizationTable {
  id: Generated<string>;
  name: string;
  slug: string;
  logo: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Generated<Date>;
}

export interface MemberTable {
  id: Generated<string>;
  organizationId: string;
  userId: string;
  role: string;
  createdAt: Generated<Date>;
}

export interface InvitationTable {
  id: Generated<string>;
  organizationId: string;
  email: string;
  role: string;
  status: string;
  teamId: string | null;
  inviterId: string;
  expiresAt: Date;
  createdAt: Generated<Date>;
}

export interface TeamTable {
  id: Generated<string>;
  name: string;
  organizationId: string;
  createdAt: Generated<Date>;
  updatedAt: Date | null;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export type Session = Selectable<SessionTable>;
export type NewSession = Insertable<SessionTable>;
export type SessionUpdate = Updateable<SessionTable>;

export type Account = Selectable<AccountTable>;
export type NewAccount = Insertable<AccountTable>;
export type AccountUpdate = Updateable<AccountTable>;

export type Verification = Selectable<VerificationTable>;
export type NewVerification = Insertable<VerificationTable>;
export type VerificationUpdate = Updateable<VerificationTable>;

export type AuditLog = Selectable<AuditLogTable>;
export type NewAuditLog = Insertable<AuditLogTable>;
export type AuditLogUpdate = Updateable<AuditLogTable>;

export type Organization = Selectable<OrganizationTable>;
export type NewOrganization = Insertable<OrganizationTable>;
export type OrganizationUpdate = Updateable<OrganizationTable>;

export type Member = Selectable<MemberTable>;
export type NewMember = Insertable<MemberTable>;
export type MemberUpdate = Updateable<MemberTable>;

export type Invitation = Selectable<InvitationTable>;
export type NewInvitation = Insertable<InvitationTable>;
export type InvitationUpdate = Updateable<InvitationTable>;

export type Team = Selectable<TeamTable>;
export type NewTeam = Insertable<TeamTable>;
export type TeamUpdate = Updateable<TeamTable>;
