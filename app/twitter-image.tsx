import { ImageResponse } from "next/og";

export const alt = "DarkGlance — FullStack Developer & Software Craftsman";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#050202",
          color: "#fff4ea",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 20% 50%, #ff3b0088, transparent 45%),radial-gradient(ellipse at 74% 57%, #ffb30099, transparent 44%),radial-gradient(ellipse at 73% 12%, #d4607a66, transparent 34%)",
          }}
        />
        <span
          style={{
            fontSize: 24,
            letterSpacing: 8,
            color: "#ffb300",
            zIndex: 1,
            textTransform: "uppercase",
          }}
        >
          Ashif · Chennai, India · FullStack Developer
        </span>
        <strong
          style={{
            fontSize: 108,
            letterSpacing: -6,
            zIndex: 1,
            marginTop: 24,
            lineHeight: 1,
          }}
        >
          DarkGlance
        </strong>
        <span
          style={{
            fontSize: 32,
            color: "#b9a89c",
            zIndex: 1,
            marginTop: 20,
            maxWidth: 900,
          }}
        >
          I build tools nobody asked for, then everybody needs.
        </span>
      </div>
    ),
    size,
  );
}
