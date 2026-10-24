import {
  siApachecassandra,
  siApachekafka,
  siBootstrap,
  siCloudinary,
  siCss,
  siDotnet,
  siElastic,
  siElasticsearch,
  siExpo,
  siExpress,
  siFirebase,
  siGooglegemini,
  siHtml5,
  siNextdotjs,
  siNodedotjs,
  siOpenjdk,
  siReact,
  siRedis,
  siSharp,
  siSocketdotio,
  siSpringboot,
  siStripe,
  siTypescript,
  siVite,
} from "simple-icons";
import type { CSSProperties } from "react";
import type { Locale } from "../../features/content/types";

type BrandIcon = { path: string; hex: string };

const identities: { matches: (name: string) => boolean; icon: BrandIcon }[] = [
  { matches: (name) => name.startsWith("React"), icon: siReact },
  { matches: (name) => name.startsWith("Vite"), icon: siVite },
  { matches: (name) => name.startsWith("TypeScript"), icon: siTypescript },
  { matches: (name) => name.startsWith("Next.js"), icon: siNextdotjs },
  { matches: (name) => name.startsWith("Node.js"), icon: siNodedotjs },
  { matches: (name) => name.startsWith("Express"), icon: siExpress },
  { matches: (name) => name.startsWith("Firebase"), icon: siFirebase },
  { matches: (name) => name.startsWith("Cloudinary"), icon: siCloudinary },
  { matches: (name) => name.startsWith("Socket.IO"), icon: siSocketdotio },
  { matches: (name) => name.startsWith("Redis"), icon: siRedis },
  { matches: (name) => name.startsWith("Gemini"), icon: siGooglegemini },
  { matches: (name) => name.startsWith("Spring Boot"), icon: siSpringboot },
  { matches: (name) => name === "Java", icon: siOpenjdk },
  {
    matches: (name) => name.startsWith("Apache Cassandra"),
    icon: siApachecassandra,
  },
  { matches: (name) => name === "Kafka", icon: siApachekafka },
  {
    matches: (name) => name.startsWith("Elasticsearch"),
    icon: siElasticsearch,
  },
  { matches: (name) => name === "Elastic", icon: siElastic },
  { matches: (name) => name.startsWith("Expo"), icon: siExpo },
  { matches: (name) => name === "Stripe", icon: siStripe },
  { matches: (name) => name === "HTML", icon: siHtml5 },
  { matches: (name) => name === "CSS", icon: siCss },
  { matches: (name) => name === "Bootstrap", icon: siBootstrap },
  { matches: (name) => name === "C#", icon: siSharp },
  { matches: (name) => name === ".NET", icon: siDotnet },
];

const skins = [
  { surface: "bg-[#19313a]", accent: "#92e6df", ghost: "text-[#92e6df]" },
  { surface: "bg-[#31313d]", accent: "#c6c5ff", ghost: "text-[#c6c5ff]" },
  { surface: "bg-[#3b2d20]", accent: "#ffbd76", ghost: "text-[#ffbd76]" },
  { surface: "bg-[#26342a]", accent: "#b5ed8d", ghost: "text-[#b5ed8d]" },
  { surface: "bg-[#2e2737]", accent: "#efa9ff", ghost: "text-[#efa9ff]" },
];

const footprints = [
  "md:col-span-2 md:min-h-[13.5rem]",
  "md:min-h-[10.5rem]",
  "md:min-h-[10.5rem]",
  "md:min-h-[10.5rem]",
  "md:col-span-2 md:min-h-[10.5rem]",
];

function iconFor(name: string) {
  return identities.find((identity) => identity.matches(name))?.icon;
}

export function ProjectStack({
  stack,
  locale,
}: {
  stack: string[];
  locale: Locale;
}) {
  const copy = locale === "vi";

  return (
    <section className="page-width pb-24 md:pb-36">
      <div className="grid gap-10 border-t border-white/15 pt-6 md:grid-cols-[.55fr_1.45fr]">
        <div>
          <p className="editorial-kicker text-[var(--accent)]">
            {copy ? "Công nghệ" : "Technologies"}
          </p>
          <h2 className="display mt-5 max-w-sm text-5xl font-bold leading-[.84] md:text-7xl">
            {copy ? "Stack của dự án." : "Project stack."}
          </h2>
          <p className="mt-7 max-w-sm text-base leading-relaxed text-white/60">
            {copy
              ? "Các ngôn ngữ, framework và dịch vụ được dùng trong dự án."
              : "Languages, frameworks, and services used in the project."}
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2" role="list">
          {stack.map((item, index) => {
            const icon = iconFor(item);
            const skin = skins[index % skins.length];
            const style = { "--stack-accent": skin.accent } as CSSProperties;

            return (
              <li
                key={item}
                style={style}
                className={`group relative isolate overflow-hidden rounded-[14px] px-5 py-5 ${skin.surface} ${footprints[index % footprints.length]}`}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full border border-[color:var(--stack-accent)] opacity-35 transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-6 left-6 h-14 w-14 rotate-45 border border-[color:var(--stack-accent)] opacity-30"
                />
                <div className="relative flex h-full flex-col justify-between gap-10">
                  <div className="flex items-start justify-between gap-4">
                    {icon ? (
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-9 w-9"
                        style={{ color: `#${icon.hex}` }}
                      >
                        <path d={icon.path} fill="currentColor" />
                      </svg>
                    ) : (
                      <span
                        className={`mono text-xl ${skin.ghost}`}
                        aria-hidden="true"
                      >
                        &lt;/&gt;
                      </span>
                    )}
                    <span
                      className={`mono text-[10px] tracking-[.12em] ${skin.ghost} opacity-75`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="max-w-[15ch] text-xl font-medium leading-tight text-white md:text-2xl">
                    {item}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
