import { site } from "@/data/site";

export const revalidate = 3600;
export async function getGitHubPulse() {
  const repos = site.projects
    .filter((project) => project.links.github)
    .map((project) => project);
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
  return {
    starsById: Object.fromEntries(records.map(({ id, stars }) => [id, stars])),
    ...records.reduce(
      (total, item) => ({
        stars: total.stars + item.stars,
        commits: total.commits + item.commits,
      }),
      { stars: 0, commits: 0 },
    ),
  };
}
