# DarkGlance Portfolio

A dark, cinematic portfolio built with Next.js 15 App Router, TypeScript, Tailwind CSS v4, themed Radix/shadcn-style primitives, Motion, Lenis, and OGL. All personal copy and project records are in `data/site.ts`.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Setup commands

This workspace was scaffolded directly with Next.js dependencies so the project could live at the workspace root. The visual primitives are locally themed and use Radix UI. To initialize the shadcn registry for future generated components:

```bash
npx shadcn@latest init
npx shadcn@latest add button badge card tabs dialog sheet command tooltip hover-card separator scroll-area sonner avatar skeleton
```

## Environment

| Variable               | Required                   | Purpose                                                                                         |
| ---------------------- | -------------------------- | ----------------------------------------------------------------------------------------------- |
| `GITHUB_TOKEN`         | No                         | Optional GitHub REST API token for higher rate limits. Public repository data works without it. |
| `NEXT_PUBLIC_SITE_URL` | Recommended for deployment | Canonical portfolio URL used by Open Graph metadata, `sitemap.xml`, and `robots.txt`.           |

Repository stars are fetched from GitHub and cached for 3600 seconds. If GitHub is unavailable, the project fallback counts in `data/site.ts` are used. Commit counts use only the supplied fallback values.

## Deploy

Import this repository into Vercel, set `GITHUB_TOKEN` if desired and `NEXT_PUBLIC_SITE_URL` to the chosen portfolio domain, then deploy. The project uses Next.js metadata routes for Open Graph, sitemap, and robots output.

## Owner TODOs

- Replace each abstract project cover with a real screenshot when available (`TODO: screenshot` slots are shown on project art).
- Confirm/complete TicketRadar’s tech stack and add its GitHub repository URL if it is public.
- Confirm/complete TacToeTic’s tech stack.
- Decide whether to add employer or experience information; none is currently displayed.
- Optionally replace the Wanted Poster’s abstract initials silhouette with an original owner illustration.
- Tune the synthesized Den Den Mushi tone if desired. Sound starts muted and only plays after a visitor enables it.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

The project respects reduced motion, disables the custom cursor on touch devices, lazily creates the OGL canvas after hydration, and keeps a CSS gradient fallback for devices without WebGL.
