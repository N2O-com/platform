"use client";

import dynamic from "next/dynamic";

// Disable SSR for react-admin since it uses react-router which conflicts with Next.js
// This catch-all route allows ra-core's react-router to handle all internal routing
const AdminDashboard = dynamic(() => import("../admin-client"), {
  ssr: false,
  loading: () => <div>Loading admin dashboard…</div>,
});

export default function DashboardCatchAll() {
  return <AdminDashboard />;
}
