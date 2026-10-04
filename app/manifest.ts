import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DarkGlance — FullStack Developer & Software Craftsman",
    short_name: "DarkGlance",
    description:
      "Dark cinematic developer portfolio for Ashif / DarkGlance. Specializing in Python, FastAPI, Next.js, and high-performance automation.",
    start_url: "/",
    display: "standalone",
    background_color: "#050202",
    theme_color: "#050202",
    orientation: "portrait",
    categories: ["development", "portfolio", "technology"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
      {
        src: "/assets/DG.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/assets/DG.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
