type StatsCardProps = {
  title: string;
  value: string;
};

export default function StatsCard({
  title,
  value,
}: StatsCardProps) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <h3>{title}</h3>

      <h1
        style={{
          color: "#f59e0b",
          marginTop: "10px",
        }}
      >
        {value}
      </h1>
    </div>
  );
}
