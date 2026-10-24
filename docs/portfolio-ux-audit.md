# Portfolio UX audit and vitality plan

## Reading this as

An anti-slop personal developer portfolio for recruiters, product teams, and clients. The brand has a playful-tech signature from the Kamling orange, leaf green, and ink navy. The right direction is an editorial product story with evidence-led interactions, not a generic landing page or a dashboard.

## Executive assessment

The current build is technically healthy and visually coherent, but it is not yet persuasive. Several pages use the same recipe: a small label, a very large heading, a two-column grid, and a row of cards. That creates consistency without enough change of pace. The result is polished whitespace that feels inactive rather than intentional.

| Area | Current signal | Score / 10 | What it needs |
| --- | --- | ---: | --- |
| First impression | Strong logo, clear developer positioning, distinctive orange accent | 7 | Add a concrete proof point and availability signal above the fold |
| Hierarchy | Oversized headings dominate most pages | 5 | Give each page one job and one primary action |
| Vitality | About tools and Lab are mostly static text and empty space | 4 | Replace inventory with artifacts, relationships, and small moments of interaction |
| Project proof | Featured work exists, but outcomes and role are not prominent enough | 6 | Show role, constraints, result, and evidence before the stack |
| Hire conversion | Contact is a general message form | 3 | Add a dedicated hiring path, fit selector, and resume access |
| Navigation | Work, About, Journal, Contact are clear | 6 | Promote Resume and Hire me as first-class destinations |
| Mobile clarity | Layout collapses, but the same large typographic rhythm remains | 6 | Shorten the path to proof and action on small screens |

## Why the pages feel lifeless

1. **Space has no stated purpose.** The pale Tools section has a large quiet field, but no visual anchor, progression, or result for the visitor to discover.
2. **Tools are listed, not demonstrated.** `TypeScript`, `React`, and `Docker` tell a recruiter what is known; a linked project outcome tells them how well it is used.
3. **The Lab cards are static promises.** “Fluid cursor”, “Depth scroll”, and “Joy CLI” look like labels rather than live experiments with a screenshot, status, or launch action.
4. **The composition repeats across routes.** Repetition is useful for a system, but every page currently speaks with the same volume and cadence.
5. **The conversion moment is hidden.** Someone who wants to hire or interview the owner has to infer that Contact is the next step. There is no CV route, hiring context, response expectation, or engagement choice.
6. **The content model is richer than the public story.** Admin and project data already support more useful states. The public UI should surface role, outcome, featured priority, and proof links instead of stopping at title, summary, and stack.

## Target visitor journey

```text
Meet the person
    -> See one credible result
        -> Understand how they work
            -> Check fit and availability
                -> View CV or send a focused brief
```

Every public page should make the next step obvious, while still allowing exploration.

## Proposed information architecture

| Route | Job to be done | Primary action | Secondary action |
| --- | --- | --- | --- |
| `/` | Establish identity and taste quickly | View selected work | View CV |
| `/work` | Compare proof across projects | Open a case study | Filter by type |
| `/work/[slug]` | Show decision quality and outcomes | Start a similar conversation | Next project |
| `/about` | Explain working style and credibility | See capabilities in context | View CV |
| `/resume` | Let a recruiter scan, print, or download | Download CV PDF | Hire me |
| `/hire` | Qualify an opportunity without a cold wall of text | Send project brief | Email directly |
| `/contact` | Provide a general fallback channel | Send message | View work |
| `/journal` | Build point of view and trust | Read a note | Return to work |

`Resume` and `Hire me` should appear in the desktop header, mobile menu, homepage hero, and footer. Contact remains useful, but it should no longer be the only conversion surface.

## UI direction for the next pass

### Resume / CV

- Use an editorial two-column layout: a narrow identity rail with availability, location, email, and download; a fluid reading column for profile, experience, selected impact, skills, and education.
- Add a sticky action rail on desktop and a bottom action bar on mobile with `Download CV`, `Hire me`, and `Email`.
- Use print CSS so `/resume` is a useful printable CV even when the PDF is not available.
- Attach one evidence link to each meaningful experience item: project, article, or outcome.
- Show `Last updated` and a clear version date so the document feels maintained.

### Hire me

- Make the page feel like an open door, not a pricing table.
- Start with a compact fit selector: `Full-time`, `Freelance build`, `Product / technical direction`, or `Just a conversation`.
- Ask only the minimum first-pass fields: name, email, context, desired outcome, timing, and optional budget range.
- Keep an always-visible alternate path: direct email and expected response time.
- Route submissions through the existing Resend + Supabase message flow with an explicit intent field (`hire`, `general`, `speaking`).
- After submission, show what happens next and a link to relevant work. Do not expose delivery-provider details.

### About, Tools, and Lab

- Replace the word wall with a “capabilities in context” evidence rail. Each capability should point to one or two real projects and a short result.
- Replace three equal Lab cards with one featured experiment and a smaller list of experiments. Each item gets a state (`Live`, `Prototype`, `Archived`), a thumbnail or code link, and one-line intent.
- Keep the green background as a short-lived change of register, not a full empty viewport. Give it a clear start edge and end edge.
- Vary composition deliberately: About can be a portrait-led story, Work an index, Resume a document, and Hire a guided form. Do not reuse the same heading-plus-card pattern on all four.

### Work and case studies

- Keep featured ordering, but add a visible proof line: role, duration, team context, and outcome.
- Lead with the problem and result. Move the stack lower as supporting evidence.
- Add a consistent end-of-case-study decision: `Need something like this? View CV` and `Start a project brief`.

## Data and backend additions

Use Supabase as the source of truth and keep all new fields owner-editable in Admin.

- Profile: `availability_status`, `availability_note_vi`, `availability_note_en`, `resume_url`, `resume_updated_at`, `engagement_modes`, `response_time`, `preferred_contact`.
- Project: `role_vi`, `role_en`, `outcome_vi`, `outcome_en`, `duration`, `team_context`, `proof_links`, `is_confidential`.
- Lab item: `slug`, bilingual title/summary, `status`, `cover_image`, `demo_url`, `repo_url`, `sort_order`.
- Message: `intent`, `timeline`, `budget_range`, `source_path`, and the existing status fields.
- Analytics: track `resume_view`, `resume_download`, `hire_start`, `hire_submit`, `case_study_cta`, and `contact_submit` without storing raw IP addresses.

## Definition of done for the revival

- A first-time visitor can reach a real CV or a focused hiring form within one click from every primary page.
- `/resume` works on screen, keyboard, mobile, and print; the PDF download is optional but not the only way to read the CV.
- `/hire` has bilingual copy, validation, success, error, spam, and network-failure states.
- About Tools and Lab contain evidence or an action for every visible item; no large section exists only to hold a heading.
- At least three pages use intentionally different composition families while sharing the same tokens.
- Lighthouse-style checks show no critical accessibility issue, no layout overflow at 320 px, and no blocking animation on reduced motion.
- Conversion events appear in the private analytics dashboard and never include message bodies or sensitive query values.

## Decisions needed before implementation

1. The actual CV content or PDF source, including the preferred display name and current role.
2. Which engagement modes are genuinely open now: full-time, freelance, consulting, or conversation only.
3. The preferred response promise and contact email to show publicly.

## Revival pass completed (2026-08-29)

The first visual revival pass is now implemented in the public app:

- Work is an image-led archive with a featured project, functional category filters, grid/list toggle, and an asymmetric project rhythm.
- Case studies now use a dark narrative composition with a clear outcome band, decision story, visual evidence, technical stack, CV CTA, and next project.
- About is portrait-led and includes a working-principles register, evidence timeline, tools in context, and a featured Lab experiment.
- Resume has a persistent identity rail with portrait, availability, response time, print/download actions, and evidence links.
- Hire and Contact keep the focused Resend + Supabase form flow while making intent, fit, response time, CV, and alternate contact paths obvious.
- Reveal animations no longer hide content before hydration. They begin visible and add a restrained vertical settle, with reduced-motion support preserved.
- Shared display tracking was tightened to `-0.035em` to keep large type expressive without collapsing counters or harming scanability.

The next content decision is still the actual public CV PDF and the final engagement modes. The UI has safe fallbacks until those owner inputs are supplied.
