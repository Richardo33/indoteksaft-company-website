import { ImageResponse } from "next/og";

export const alt = "Indoteksaft — Engineering the sovereign digital core";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          color: "white",
          background:
            "radial-gradient(circle at 80% 20%, #063da8 0, #050b18 42%, #030712 100%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, fontWeight: 700, color: "#67e8f9" }}>
          INDOTEKSAFT
        </div>
        <div
          style={{
            display: "flex",
            maxWidth: 900,
            marginTop: 34,
            fontSize: 68,
            lineHeight: 1.05,
            fontWeight: 800,
            letterSpacing: "-3px",
          }}
        >
          Engineering the sovereign digital core.
        </div>
        <div style={{ display: "flex", marginTop: 34, fontSize: 24, color: "#94a3b8" }}>
          Critical infrastructure · Cybersecurity · Cloud · Data & AI
        </div>
      </div>
    ),
    size,
  );
}
