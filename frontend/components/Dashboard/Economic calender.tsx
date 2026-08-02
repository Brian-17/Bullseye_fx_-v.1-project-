export default function EconomicCalendar() {
  const events = [
    {
      time: "09:30",
      country: "🇺🇸 USA",
      event: "Non-Farm Payrolls",
      impact: "🔴 High",
    },
    {
      time: "15:00",
      country: "🇪🇺 EUR",
      event: "ECB Interest Rate",
      impact: "🔴 High",
    },
    {
      time: "17:30",
      country: "🇬🇧 GBP",
      event: "GDP Report",
      impact: "🟠 Medium",
    },
  ];

  return (
    <div
      style={{
        background: "#ffffff",
        padding: "25px",
        borderRadius: "12px",
        marginTop: "30px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <h2>📅 Economic Calendar</h2>

      <table
        style={{
          width: "100%",
          marginTop: "20px",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th align="left">Time</th>
            <th align="left">Country</th>
            <th align="left">Event</th>
            <th align="left">Impact</th>
          </tr>
        </thead>

        <tbody>
          {events.map((event, index) => (
            <tr key={index}>
              <td style={{ padding: "10px 0" }}>{event.time}</td>
              <td>{event.country}</td>
              <td>{event.event}</td>
              <td>{event.impact}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
        }
