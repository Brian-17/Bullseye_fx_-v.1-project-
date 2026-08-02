import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import StatsCard from "../../components/dashboard/StatsCard";
import PerformanceChart from "../../components/dashboard/PerformanceChart";

export default function DashboardPage() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Topbar />

        <main style={{ padding: "30px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
              gap: "20px",
            }}
          >
            <StatsCard title="Total Trades" value="0" />
            <StatsCard title="Win Rate" value="0%" />
            <StatsCard title="Account Balance" value="$0.00" />
            <StatsCard title="Active Signals" value="0" />
          </div>

          <PerformanceChart />
        </main>
      </div>
    </div>
  );
}
