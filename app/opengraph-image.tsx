import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ijo Itusile — Sanctuary of Freedom";
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
          padding: 72,
          background: "linear-gradient(135deg, #0B2A6F 0%, #1E5BD8 55%, #38BDF8 100%)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 4, textTransform: "uppercase", color: "#38BDF8" }}>
          Sundays of Power
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, marginTop: 16 }}>Ijo Itusile</div>
        <div style={{ fontSize: 32, marginTop: 12, color: "#F5B700" }}>Sanctuary of Freedom</div>
        <div style={{ fontSize: 24, marginTop: 24 }}>Come, Be Refreshed. Be Healed. Be Transformed.</div>
      </div>
    ),
    size,
  );
}
