import Link from "next/link";

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
