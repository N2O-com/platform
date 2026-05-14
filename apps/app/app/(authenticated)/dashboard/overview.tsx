"use client";

import { Alert, AlertDescription } from "@repo/design/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design/components/ui/card";
import { Skeleton } from "@repo/design/components/ui/skeleton";
import {
  AlertCircleIcon,
  Building2Icon,
  MailIcon,
  ShieldCheckIcon,
  UserCheckIcon,
  UsersIcon,
} from "lucide-react";
import { useOverview } from "./hooks";
import { PageHeader, PageShell } from "./page-shell";

type StatProps = {
  label: string;
  value: number | undefined;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
};

const Stat = ({ label, value, description, icon: Icon }: StatProps) => (
  <Card>
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <CardDescription>{label}</CardDescription>
          <CardTitle className="text-3xl tabular-nums">
            {value === undefined ? (
              <Skeleton className="h-9 w-20" />
            ) : (
              value.toLocaleString()
            )}
          </CardTitle>
        </div>
        <Icon className="size-5 text-muted-foreground" />
      </div>
    </CardHeader>
    {description && (
      <CardContent>
        <p className="text-muted-foreground text-xs">{description}</p>
      </CardContent>
    )}
  </Card>
);

export const Overview = () => {
  const { data, isLoading, error } = useOverview();

  return (
    <PageShell>
      <PageHeader description="Platform health at a glance" title="Overview" />

      {error ? (
        <Alert variant="destructive">
          <AlertCircleIcon className="size-4" />
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Stat
            icon={UsersIcon}
            label="Total users"
            value={isLoading ? undefined : data?.users}
          />
          <Stat
            icon={UserCheckIcon}
            label="Verified users"
            value={isLoading ? undefined : data?.verifiedUsers}
          />
          <Stat
            icon={AlertCircleIcon}
            label="Banned users"
            value={isLoading ? undefined : data?.bannedUsers}
          />
          <Stat
            icon={Building2Icon}
            label="Organizations"
            value={isLoading ? undefined : data?.organizations}
          />
          <Stat
            icon={MailIcon}
            label="Pending invitations"
            value={isLoading ? undefined : data?.pendingInvitations}
          />
          <Stat
            icon={ShieldCheckIcon}
            label="Active sessions"
            value={isLoading ? undefined : data?.activeSessions}
          />
        </div>
      )}
    </PageShell>
  );
};
