import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Lost in the Grand Line",
  description: "The page you are looking for does not exist on DarkGlance.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="not-found">
      <span className="eyebrow">404 · LOST AT SEA</span>
      <h1>
        Lost in the
        <br />
        <em>Grand Line.</em>
      </h1>
      <p>The Log Pose is spinning. This page hasn’t been charted yet.</p>
      <Link className="button button-primary" href="/">
        Sail back home <span>↗</span>
      </Link>
      <div className="lost-compass">✳</div>
    </main>
  );
}
