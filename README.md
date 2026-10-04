# DarkGlance Portfolio

Personal developer portfolio web application for [DarkGlance](https://darkglance.in).

Built with Next.js, React, TypeScript, and Tailwind CSS.

---

## Getting Started

### Prerequisites

- Node.js 18.17+ or later
- npm, pnpm, or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Ashif4354/DarkGlanceApp.git
cd DarkGlanceApp

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

---

## Environment Variables

Configure the following variables in your `.env` file:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical URL for the site (e.g. `https://darkglance.in`). |
| `NEXT_PUBLIC_GTM_ID` | Optional | Google Tag Manager Container ID (e.g. `GTM-XXXXXXX`). |
| `GITHUB_TOKEN` | Optional | GitHub Personal Access Token to raise GitHub API rate limits for repository data. |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Runs the Next.js development server |
| `npm run build` | Compiles the production build with static generation |
| `npm run start` | Starts the production server locally |
| `npm run lint` | Runs ESLint to check for code quality and formatting |
| `npm run typecheck` | Checks TypeScript types across the codebase |

---

## License

MIT © [Ashif (DarkGlance)](https://darkglance.in)
