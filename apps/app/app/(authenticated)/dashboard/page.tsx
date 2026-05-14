"use client";

import dynamic from "next/dynamic";

// Disable SSR for react-admin since it uses react-router which conflicts with Next.js
const AdminDashboard = dynamic(() => import("./admin-client"), {
  ssr: false,
  loading: () => <div>Loading admin dashboard…</div>,
});

export default function DashboardPage() {
  return <AdminDashboard />;
}
