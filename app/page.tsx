import { getGitHubPulse } from "@/lib/github";
import { Portfolio } from "@/components/Portfolio";

export const revalidate = 3600;
export default async function Home() {
  const pulse = await getGitHubPulse();
  return <Portfolio pulse={pulse} />;
}
