import { ParticleNetwork } from "../components/site/particle-network";

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="site-shell"><div className="site-ambient" aria-hidden="true"><ParticleNetwork /></div>{children}</div>;
}
