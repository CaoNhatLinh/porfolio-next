export type Locale = "vi" | "en";

export type LocalizedText = {
  vi: string;
  en: string;
};

export type Profile = {
  name: string;
  shortName: string;
  title: LocalizedText;
  intro: LocalizedText;
  bio: LocalizedText;
  email: string;
  image: string;
  location?: string;
  availability?: LocalizedText;
  resumeUrl?: string;
  resumeUpdatedAt?: string;
  responseTime?: LocalizedText;
  engagementModes?: string[];
  socials?: { label: string; href: string }[];
  seo?: { title?: string; description?: string };
};

export type Project = {
  slug: string;
  title: string;
  category:
    "Web application" | "Mobile application" | "Backend system" | "Experiment";
  summary: LocalizedText;
  year: string;
  role: LocalizedText;
  duration?: string;
  teamContext?: LocalizedText;
  stack: string[];
  image: string;
  /** Symbolic transparent assets should be shown in full; UI screenshots may crop. */
  imageFit?: "cover" | "contain";
  isFeatured: boolean;
  links: { label: string; href: string }[];
  gallery?: { src: string; alt: string }[];
  outcome: LocalizedText;
  proofLinks?: { label: string; href: string }[];
  highlights?: {
    title: LocalizedText;
    detail: LocalizedText;
  }[];
  sections: {
    heading: LocalizedText;
    body: LocalizedText;
    tone: "light" | "dark" | "accent";
  }[];
};

export type LabItem = {
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  status: "Live" | "Prototype" | "Archived";
  coverImage?: string;
  demoUrl?: string;
  repoUrl?: string;
  sortOrder: number;
};

export type Article = {
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  body: LocalizedText;
  date: string;
  readingTime: string;
  topic: string;
  cover?: {
    src: string;
    alt: LocalizedText;
    caption?: LocalizedText;
  };
};

export const isLocale = (value: string | undefined): value is Locale =>
  value === "vi" || value === "en";

export function localized(value: LocalizedText, locale: Locale): string {
  return value[locale] || value.en;
}
