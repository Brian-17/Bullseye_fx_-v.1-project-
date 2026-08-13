"use client";

import { useEffect, useState } from "react";

import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import StatsCard from "../components/dashboard/StatsCard";
import PerformanceChart from "../components/dashboard/PerformanceChart";
import { getDashboardStats } from "../lib/Api";

type DashboardStats = {
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  breakeven_trades: number;
  win_rate: number;
  total_profit: number;
  average_profit: number;
  profit_factor: number;
  average_rr: number;
  best_pair: string | null;
  best_strategy: string | null;
  best_session: string | null;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load dashboard statistics.");
      }
    }

    loadDashboard();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f8f9fc",
      }}
    >
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Topbar />

        <main style={{ padding: "30px" }}>
          <h1 style={{ marginBottom: "25px" }}>
            Bullseye FX Dashboard
          </h1>

          {error && (
            <p style={{ color: "red", marginBottom: "20px" }}>
              {error}
            </p>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(250px,1fr))",
              gap: "20px",
            }}
          >
            <StatsCard
              title="Total Trades"
              value={stats ? String(stats.total_trades) : "..."}
            />

            <StatsCard
              title="Win Rate"
              value={stats ? `${stats.win_rate}%` : "..."}
            />

            <StatsCard
              title="Total Profit"
              value={
                stats
                  ? `$${stats.total_profit.toFixed(2)}`
                  : "..."
              }
            />

            <StatsCard
              title="Average R:R"
              value={
                stats
                  ? stats.average_rr.toFixed(2)
                  : "..."
              }
            />
          </div>

          <div style={{ marginTop: "30px" }}>
            <PerformanceChart />
          </div>

          {stats && (
            <div
              style={{
                marginTop: "30px",
                padding: "20px",
                background: "white",
                borderRadius: "12px",
              }}
            >
              <h2>Trading Summary</h2>

              <p>
                Winning trades: {stats.winning_trades}
              </p>

              <p>
                Losing trades: {stats.losing_trades}
              </p>

              <p>
                Breakeven trades: {stats.breakeven_trades}
              </p>

              <p>
                Average profit: $
                {stats.average_profit.toFixed(2)}
              </p>

              <p>
                Profit factor:{" "}
                {stats.profit_factor}
              </p>

              <p>
                Best pair:{" "}
                {stats.best_pair ?? "N/A"}
              </p>

              <p>
                Best strategy:{" "}
                {stats.best_strategy ?? "N/A"}
              </p>

              <p>
                Best session:{" "}
                {stats.best_session ?? "N/A"}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
      }
