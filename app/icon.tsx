import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#050202",
          borderRadius: 6,
          border: "1px solid #ff3b00",
          color: "#fff4ea",
          fontFamily: "system-ui, sans-serif",
          fontWeight: 900,
          fontSize: 15,
          letterSpacing: -0.5,
        }}
      >
        <span style={{ color: "#fff4ea" }}>D</span>
        <span style={{ color: "#ff3b00" }}>G</span>
      </div>
    ),
    { ...size },
  );
}
