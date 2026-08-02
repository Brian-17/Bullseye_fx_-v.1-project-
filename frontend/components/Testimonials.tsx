export default function Testimonials() {
  return (
    <section
      style={{
        padding: "80px 20px",
        background: "#ffffff",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
        What Our Students Say
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "25px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: "300px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "12px",
          }}
        >
          <h3>⭐⭐⭐⭐⭐</h3>
          <p>
            "Bullseye FX completely changed how I analyze the markets."
          </p>
          <strong>- Student A</strong>
        </div>

        <div
          style={{
            width: "300px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "12px",
          }}
        >
          <h3>⭐⭐⭐⭐⭐</h3>
          <p>
            "The ICT lessons and signals helped me become more disciplined."
          </p>
          <strong>- Student B</strong>
        </div>
      </div>
    </section>
  );
          }
