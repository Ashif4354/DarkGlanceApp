import { site } from "@/data/site";

export const revalidate = 3600;

export type GitHubPulseData = {
  starsById: Record<string, number>;
  stars: number;
  commits: number;
};

const defaultPulse: GitHubPulseData = {
  starsById: Object.fromEntries(
    site.projects.map((p) => [p.id, p.stats?.stars || 0]),
  ),
  stars: site.projects.reduce((sum, p) => sum + (p.stats?.stars || 0), 0),
  commits: site.projects.reduce((sum, p) => sum + (p.stats?.commits || 0), 0),
};

let memoryCache: { data: GitHubPulseData; timestamp: number } | null = null;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function getGitHubPulse(): Promise<GitHubPulseData> {
  const now = Date.now();
  if (memoryCache && now - memoryCache.timestamp < CACHE_TTL_MS) {
    return memoryCache.data;
  }

  const repos = site.projects.filter((project) => project.links.github);

  try {
    const records = await Promise.all(
      repos.map(async (project) => {
        const slug = project.links.github!.replace("https://github.com/", "");
        try {
          const response = await fetch(`https://api.github.com/repos/${slug}`, {
            headers: process.env.GITHUB_TOKEN
              ? {
                  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                  Accept: "application/vnd.github+json",
                }
              : { Accept: "application/vnd.github+json" },
            next: { revalidate: 3600 },
            signal: AbortSignal.timeout(1200),
          });
          if (!response.ok) throw new Error("GitHub API unavailable");
          const data = await response.json();
          return {
            id: project.id,
            stars: Number(data.stargazers_count) || project.stats?.stars || 0,
            commits: project.stats?.commits || 0,
          };
        } catch {
          return {
            id: project.id,
            stars: project.stats?.stars || 0,
            commits: project.stats?.commits || 0,
          };
        }
      }),
    );

    const result: GitHubPulseData = {
      starsById: Object.fromEntries(
        records.map(({ id, stars }) => [id, stars]),
      ),
      ...records.reduce(
        (total, item) => ({
          stars: total.stars + item.stars,
          commits: total.commits + item.commits,
        }),
        { stars: 0, commits: 0 },
      ),
    };

    memoryCache = { data: result, timestamp: now };
    return result;
  } catch {
    return defaultPulse;
  }
}
