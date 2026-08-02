import MarketOverview from "../../components/dashboard/MarketOverview";import StatsCard from "../../components/dashboard/StatsCard";
import PerformanceChart from "../../components/dashboard/PerformanceChart";
export default function DashboardPage() {
  return (
    <main
      style={{
        padding: "40px",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <h1>Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <StatsCard title="Total Trades" value="0" />
        <StatsCard title="Win Rate" value="0%" />
        <StatsCard title="Account Balance" value="$0.00" />
        <StatsCard title="Active Signals" value="0" />
      </div>

      <PerformanceChart />
    </main>
  );
  <PerformanceChart />
}
