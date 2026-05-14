"use client";

import { cn } from "@repo/design/lib/utils";
import { Building2Icon, LayoutDashboardIcon, UsersIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const items = [
  {
    to: "/",
    label: "Overview",
    icon: LayoutDashboardIcon,
    match: (p: string) => p === "/",
  },
  {
    to: "/users",
    label: "Users",
    icon: UsersIcon,
    match: (p: string) => p.startsWith("/users"),
  },
  {
    to: "/organizations",
    label: "Organizations",
    icon: Building2Icon,
    match: (p: string) => p.startsWith("/organizations"),
  },
];

export const Nav = () => {
  const location = useLocation();
  return (
    <nav className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto px-4">
        <ul className="flex gap-1 overflow-x-auto">
          {items.map((item) => {
            const active = item.match(location.pathname);
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  className={cn(
                    "flex items-center gap-2 border-b-2 px-3 py-3 font-medium text-sm transition-colors",
                    active
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                  to={item.to}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
