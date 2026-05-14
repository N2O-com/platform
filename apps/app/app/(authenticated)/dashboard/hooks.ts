"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const json = async (input: RequestInfo, init?: RequestInit) => {
  const res = await fetch(input, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const message = await res
      .json()
      .then((d) => d.message)
      .catch(() => null);
    throw new Error(message ?? `Request failed (${res.status})`);
  }
  return res.json();
};

// ---------- Overview ----------

export type Overview = {
  users: number;
  verifiedUsers: number;
  bannedUsers: number;
  organizations: number;
  pendingInvitations: number;
  activeSessions: number;
};

export const useOverview = () =>
  useQuery({
    queryKey: ["admin", "overview"],
    queryFn: () => json("/api/admin/overview") as Promise<Overview>,
  });

// ---------- Organizations ----------

export type OrganizationRow = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  createdAt: string;
  memberCount: number;
};

export type OrganizationDetail = {
  organization: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    metadata: string | null;
    createdAt: string;
  };
  members: Array<{
    id: string;
    role: "owner" | "admin" | "member";
    createdAt: string;
    userId: string;
    userName: string;
    userEmail: string;
    userImage: string | null;
  }>;
  invitations: Array<{
    id: string;
    email: string;
    role: string;
    status: string;
    expiresAt: string;
    createdAt: string;
  }>;
  teams: Array<{
    id: string;
    name: string;
    createdAt: string;
  }>;
};

export const useOrganizations = () =>
  useQuery({
    queryKey: ["admin", "organizations"],
    queryFn: () =>
      json("/api/admin/organizations").then(
        (d) => d.organizations as OrganizationRow[]
      ),
  });

export const useOrganization = (id: string | undefined) =>
  useQuery({
    queryKey: ["admin", "organizations", id],
    enabled: Boolean(id),
    queryFn: () =>
      json(`/api/admin/organizations/${id}`) as Promise<OrganizationDetail>,
  });

export const useDeleteOrganization = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      json(`/api/admin/organizations/${id}`, { method: "DELETE" }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["admin", "organizations"] }),
  });
};

export const useCreateOrganization = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; slug: string }) =>
      json("/api/admin/organizations", {
        method: "POST",
        body: JSON.stringify(input),
      }).then((d) => d.organization as OrganizationRow),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["admin", "organizations"] }),
  });
};

// ---------- Members ----------

export const useUpdateMemberRole = (organizationId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      memberId,
      role,
    }: {
      memberId: string;
      role: "owner" | "admin" | "member";
    }) =>
      json(`/api/admin/organizations/${organizationId}/members/${memberId}`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      }),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["admin", "organizations", organizationId],
      }),
  });
};

export const useRemoveMember = (organizationId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) =>
      json(`/api/admin/organizations/${organizationId}/members/${memberId}`, {
        method: "DELETE",
      }),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["admin", "organizations", organizationId],
      }),
  });
};

// ---------- Teams ----------

export const useCreateTeam = (organizationId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) =>
      json(`/api/admin/organizations/${organizationId}/teams`, {
        method: "POST",
        body: JSON.stringify({ name }),
      }),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["admin", "organizations", organizationId],
      }),
  });
};

export const useUpdateTeam = (organizationId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ teamId, name }: { teamId: string; name: string }) =>
      json(`/api/admin/organizations/${organizationId}/teams/${teamId}`, {
        method: "PATCH",
        body: JSON.stringify({ name }),
      }),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["admin", "organizations", organizationId],
      }),
  });
};

export const useDeleteTeam = (organizationId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (teamId: string) =>
      json(`/api/admin/organizations/${organizationId}/teams/${teamId}`, {
        method: "DELETE",
      }),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["admin", "organizations", organizationId],
      }),
  });
};

// ---------- Invitations ----------

export const useCancelInvitation = (organizationId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (invitationId: string) =>
      json(
        `/api/admin/organizations/${organizationId}/invitations/${invitationId}`,
        { method: "DELETE" }
      ),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["admin", "organizations", organizationId],
      }),
  });
};

// ---------- User actions ----------

export const useBanUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      reason,
      expiresIn,
    }: {
      userId: string;
      reason?: string;
      expiresIn?: number;
    }) =>
      json(`/api/admin/users/${userId}/ban`, {
        method: "POST",
        body: JSON.stringify({ reason, expiresIn }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
};

export const useUnbanUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      json(`/api/admin/users/${userId}/unban`, { method: "POST" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
};

export const useRevokeUserSessions = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      json(`/api/admin/users/${userId}/revoke-sessions`, { method: "POST" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
};
