# Product specification

## Objective

Build an artistic, high-performance personal developer portfolio for Cao Nhat Linh. The public experience is multi-page and gives each content type its own visual rhythm. A private admin area lets the owner maintain content, prioritize featured projects, review messages, and inspect traffic.

## Audiences

- Recruiters scanning skills, experience, and strongest work.
- Clients evaluating delivery quality and technical depth.
- Developers reading technical articles and experiments.
- The owner maintaining the site without editing source code.

## Public routes

| Route | Purpose |
| --- | --- |
| `/` | Brand introduction and one featured-project teaser |
| `/work` | Filterable project gallery, featured projects first |
| `/work/[slug]` | Detailed project case study |
| `/about` | Biography, principles, experience, tools, and Lab |
| `/journal` | Technical writing index |
| `/journal/[slug]` | Article detail |
| `/contact` | Contact information and project inquiry form |

## Private routes

| Route | Purpose |
| --- | --- |
| `/login` | Owner sign-in only |
| `/admin` | Overview and traffic summary |
| `/admin/profile` | Core bilingual profile fields and profile media URL |
| `/admin/projects` | Project list, ordering, publishing, archive, and featured state |
| `/admin/projects/[id]` | Core case-study metadata, stack, outcomes, and cover URL editor |
| `/admin/articles` | Article editing and publishing |
| `/admin/media` | Uploaded media library |
| `/admin/messages` | Contact inbox and status management |
| `/admin/analytics` | 30-day traffic, pages, referrers, and engaged-time summary |
| `/admin/settings` | Account and site settings |

## Functional requirements

- Featured projects sort before normal projects using an explicit `featuredOrder`.
- Draft content never appears on public routes or metadata feeds.
- The content model supports cover media, stack, role, year, links, outcomes, and typed case-study sections. The v1 admin editor manages the core fields; gallery/section editing is a documented follow-up.
- Admin forms support validation, loading, empty, success, conflict, and error states.
- Contact submissions are rate-limited, validated, and visible in admin.
- Traffic captures page, referrer domain, device family, country code when available, and a non-reversible visitor hash.
- Public pages provide route metadata, sitemap, robots rules, Open Graph defaults, and Person structured data; per-record SEO fields remain a follow-up.
- All pages work with keyboard navigation, screen readers, reduced motion, and mobile viewports.

## Non-goals for version 1

- Public user accounts or comments.
- Multi-tenant CMS.
- Real-time collaborative editing.
- E-commerce or payments.
- Visual page builder.
- Arbitrary HTML entered from admin.

## Quality targets

- Lighthouse target: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 95+ on key public routes.
- LCP under 2.5 seconds, INP under 200 ms, CLS under 0.1 at the 75th percentile.
- No horizontal overflow at 320 px.
- Admin mutations require an authenticated owner session and server-side authorization.
- `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:e2e`, and `npm run build` pass before release.

## Confirmed decisions

- Production deployment is Vercel.
- Supabase provides Auth, PostgreSQL, and Storage.
- Public content supports Vietnamese and English only.
- Contact messages send a notification through Resend, while the database remains the source of truth.
- The real admin email and recovery method are supplied through environment variables and Supabase dashboard settings.
