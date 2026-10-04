import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          borderRadius: 36,
          border: "3px solid #ff3b00",
          color: "#fff4ea",
          fontFamily: "system-ui, sans-serif",
          fontWeight: 900,
          fontSize: 84,
          letterSpacing: -3,
        }}
      >
        <span style={{ color: "#fff4ea" }}>D</span>
        <span style={{ color: "#ff3b00" }}>G</span>
      </div>
    ),
    { ...size },
  );
}
