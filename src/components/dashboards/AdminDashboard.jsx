import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import StatsCards from "./StatsCards";
import RecentProcedures from "./RecentProcedures";
import QuickActions from "./QuickActions";
import {
  listenClientsCount,
  listenProceduresLast30d,
  listenRecentProcedures,
} from "../../services/analytics";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    clientsCount: "—",
    proceduresCount30d: "—",
    revenue30d: "—",
    upcoming7d: "—",
  });
  const [recent, setRecent] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!user) return;

    const unsubs = [];

    // 1) clients count
    unsubs.push(
      listenClientsCount(
        user.uid,
        (count) =>
          setStats((s) => ({ ...s, clientsCount: count })),
        (e) => setErr(e.message)
        
      )
      
    );

    // 2) procedures last 30d
    unsubs.push(
      listenProceduresLast30d(
        user.uid,
        ({ count, sum }) =>
          setStats((s) => ({
            ...s,
            proceduresCount30d: count,
            revenue30d: sum.toFixed(2), // або просто sum
          })),
        (e) => setErr(e.message)
      )
    );

    // 3) recent procedures
    unsubs.push(
      listenRecentProcedures(
        user.uid,
        (items) => setRecent(items),
        (e) => setErr(e.message)
      )
    );

    return () => unsubs.forEach((u) => u && u());
  }, [user]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {err && (
        <div className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {err}
        </div>
      )}

      <StatsCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <RecentProcedures items={recent} />
        </div>
        <div className="space-y-6">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
