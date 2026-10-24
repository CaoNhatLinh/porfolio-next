# UI/UX V2 plan: Kamling portfolio

## Design read

This is a brand-preserving redesign for recruiters, product teams, and potential clients. The visual language remains editorial and developer-led, but every expressive choice must improve trust, scanning, or conversion.

Design dials:

- Design variance: 7/10. Asymmetric and image-led, with stricter reading order.
- Motion intensity: 5/10. Motivated transitions and feedback, no decorative motion loops.
- Visual density: 4/10. Enough evidence to feel credible without turning the portfolio into a dashboard.

## North-star outcome

A first-time visitor should understand the following within 30 seconds:

1. Who Cao Nhật Linh is and what kind of problems he solves.
2. Which project best proves that claim.
3. What role, constraints, decisions, and outcome belonged to that work.
4. How to inspect the CV or start a relevant conversation.

The target journey is:

```text
Home
  -> featured proof
    -> case-study decision quality
      -> Resume or Hire
```

Secondary journeys:

```text
About -> evidence-linked experience -> project
Journal -> point of view -> relevant project
Resume -> evidence -> Hire
```

## Current-state findings

### Strengths to preserve

- Kamling logo and orange brand accent are memorable.
- Work, About, Journal, Resume, Hire, and Contact already have distinct routes.
- Project filtering, bilingual routing, private admin, contact delivery, and analytics exist.
- Real Laravel project images are used instead of fake product dashboards.
- Resume is readable without requiring a PDF download.

### Problems to solve

| Finding | UX impact | Priority |
| --- | --- | --- |
| Display headings reach 9-15rem on several routes | Content feels louder than the evidence and can dominate tablet layouts | P0 |
| Small mono kicker appears above most section headings | Pages share the same AI-like cadence despite different jobs | P0 |
| `Hire me` appears as both a nav item and header CTA | Duplicate intent weakens hierarchy | P0 |
| Home mixes manifesto, capability, articles, and contact with similar visual weight | The visitor does not know which proof to inspect first | P0 |
| Case studies have good structure but too little verified evidence | The work reads as presentation rather than proof | P0 |
| Resume is complete but not optimized for a 20-second recruiter scan | Role, strongest impact, and current fit are not prominent enough | P0 |
| Lab can fall back to unrelated project imagery | Visual polish can reduce trust when the image is not genuine evidence | P0 |
| Journal covers reuse project images | Articles lack their own editorial identity | P1 |
| One generic Reveal behavior is used across many content types | Motion does not communicate page-specific hierarchy | P1 |
| Several pages change light/dark register more than once | Long pages can feel assembled from separate templates | P1 |
| Final accessibility and performance audit remains incomplete | Visual quality is not yet release quality | P0 |

## Reference analysis: ld​uy.dev

The useful lesson from [lduy.dev](https://lduy.dev/) is not its exact layout. Its strength is the separation between a quiet information layer and a playful personality layer. The page behaves like a scannable interactive CV first; hand-drawn marks, small color accents, a portrait, logos, a floating dock, expandable rows, and media carousels add character without changing the reading order.

### Why the reference feels clear

1. **The opening is factual.** Name, education, current company, and technical interests appear immediately instead of an abstract manifesto.
2. **The information hierarchy follows visitor intent.** About and current experience arrive before an exhaustive skills inventory or project archive.
3. **Progressive disclosure protects scanning.** Experience rows initially show company, role, status, and dates; expanding a row reveals responsibilities, measurable impact, tools, and external proof.
4. **Claims are surrounded by evidence.** Company identities, quantified outcomes, source links, award labels, project media, videos, and external coverage reduce reliance on self-description.
5. **Personality lives in details.** Annotated underlines, restrained colors, friendly copy, and interaction feedback make the page personal without weakening legibility.
6. **Different audiences can stop at different depths.** Recruiters can scan roles and dates, engineers can inspect tools and source links, and collaborators can inspect demos and project outcomes.

### Adopt for Kamling

- Put current role, specialization, availability, and strongest verified proof in the first viewport.
- Use progressive disclosure for experience and dense project details.
- Treat logos, product screens, repositories, live links, videos, and verified outcomes as proof—not decoration.
- Give each project a compact first layer and a deeper evidence layer.
- Add a persistent but unobtrusive access path to Work, CV, and Hire on small screens.
- Create one human signature device for Kamling: orange editorial annotations derived from the fruit/leaf logo rather than copying sketch underlines.

### Adapt, not copy

- Keep Kamling multi-page. The reference becomes very long because experience, projects, certificates, skills, and many hackathons share one continuous page.
- Preserve Kamling's stronger image-led art direction, but make every large visual lead to role, decision, artifact, or outcome.
- Replace the reference's broad technology inventory with capability-to-evidence links.
- Use orange annotations sparingly—no more than one signature mark in a viewport—and keep body content on a stable grid.
- Keep the header route-based on desktop; use a compact action dock only on mobile when it demonstrably improves Resume/Hire access.

### Avoid

- Do not copy the giant skills icon wall or the very long single-page archive.
- Do not publish placeholder counts, duplicate phrases, unverified metrics, or grammar mistakes.
- Do not make every row expandable; use disclosure only where the second layer contains meaningful evidence.
- Do not let decorative drawing, carousels, or motion compete with headings, dates, roles, or CTAs.

### Revised visual principle

```text
Stable editorial grid
  + one expressive Kamling gesture per viewport
  + proof adjacent to every important claim
  + progressive disclosure for depth
  = artistic, clear, and credible
```

## Experience strategy by route

### Home

Job: establish identity, specialism, and one credible proof.

- Reduce the hero to one claim, one supporting sentence, and two actions: `View work` and `View CV`.
- State current role or specialization and availability in factual language before any manifesto copy.
- Keep the portrait, but give it a clear crop and remove decorative shapes that do not communicate identity.
- Put one verified project outcome directly below the hero.
- Keep only three supporting blocks: selected proof, working approach, latest writing.
- Use one final `Hire me` invitation. Do not repeat contact-intent labels.

### Work

Job: help visitors compare projects and choose the most relevant case study.

- Keep the featured project and grid/list modes.
- Reduce the page title scale and use the saved space for role, outcome, and project type.
- Give every project tile one proof line, such as role plus outcome, instead of a generic stack dump.
- Preserve filters in the URL and add a useful empty state with a reset action.
- Remove labels over images. Put captions and metadata below the media.

### Project case study

Job: demonstrate decision quality.

- Use the same narrative order for every project: context, responsibility, constraint, decisions, evidence, outcome, reflection.
- Do not display metrics unless they come from a verified source.
- Add at least three meaningful artifacts for featured projects: product screen, flow or system view, and detail or state.
- Use a compact summary layer first, then progressive disclosure for implementation detail, media galleries, and technical notes.
- Keep live, repository, video, and external evidence links adjacent to the claim they verify.
- Add an optional architecture or process artifact only when it is based on the real implementation.
- Keep one conversion pair at the end: `View CV` and `Send brief`.

### About

Job: explain how the person works and connect claims to evidence.

- Keep the portrait-led introduction.
- Replace repeated section labels with shifts in composition and scale.
- Make experience items open the relevant project or article.
- Use real Lab covers. When none exists, show a text-first placeholder marked `Cover needed`, not an unrelated image.
- Keep tools secondary to demonstrated capabilities.

### Resume

Job: let a recruiter assess fit in 20 seconds, then inspect detail.

- Above the fold: name, role, location, availability, short positioning, print/download, and one strongest proof.
- Add a compact `Selected impact` block before chronological experience.
- Keep evidence links attached to each experience item.
- Group tools by capability and reduce decorative pills.
- Add a sticky mobile action bar for `Save PDF` and `Hire me` that disappears in print.
- Preserve clean A4 print output and include `Last updated`.

### Hire and Contact

Job: turn interest into a qualified conversation without creating friction.

- Keep Hire for work opportunities and Contact for general messages.
- Make intent differences explicit in the page copy and metadata.
- Keep the first form screen short. Reveal budget, timing, and website only after `Hire` intent is selected.
- Add a clear post-submit state: received, expected response time, and suggested project to inspect.
- Keep direct email visible as the fallback.

### Journal

Job: prove technical judgment and communication quality.

- Create article-specific covers using a consistent editorial image system.
- Keep one featured article and convert the rest into a compact index with optional thumbnails.
- Add `Related project` and `Related note` at the end of each article.
- Improve reading UX with progress, table of contents for long articles, code-block copy, and heading anchors.
- Avoid newsletter UI until a real subscription workflow exists.

## Shared design-system changes

### Typography

- Display ceiling: 6rem on desktop, with smaller route-specific clamps.
- Display letter spacing stays between -0.02em and -0.04em.
- Body line length: 65-72ch.
- Use balanced wrapping on headings and pretty wrapping on prose.
- Use a section kicker no more than once per three sections.

### Color and theme

- Keep graphite, off-white, Kamling orange, and restrained leaf green.
- Use orange as the only interactive accent.
- Green is semantic or editorial support, not a competing CTA color.
- Lock each route to one theme family. A single intentional color block is allowed when it marks a narrative turn.

### Shape and components

- Media radius: 12-16px.
- Form controls: 8-12px.
- Buttons may remain pill-shaped.
- Remove decorative card containers when spacing and a hairline provide enough grouping.
- Standardize hover, focus, pressed, loading, empty, success, and error states.

### Motion

- Hero: short entrance sequence that establishes hierarchy.
- Project media: mask or crop reveal tied to media entry.
- Filters and grid/list mode: shared-layout transition that explains reordering.
- Forms: immediate feedback for intent, validation, pending, and success.
- Respect reduced motion. Content must remain visible before hydration.
- No raw scroll listeners and no perpetual animation without semantic state.

## Implementation roadmap

### Phase A: Evidence baseline and token correction

1. Capture visual and usability baselines at 320, 375, 768, 1024, 1440, and 1920px.
2. Record keyboard order, contrast, heading hierarchy, LCP, CLS, and console/network failures.
3. Correct display scale, kicker usage, theme rules, CTA duplication, and shared component states.
4. Create an approved asset inventory for profile, projects, Lab, and Journal.

Checkpoint: shared shell and tokens pass before page recomposition starts.

### Phase B: Conversion path

1. Recompose Home around identity, one proof, and one next action.
2. Improve Work comparison and empty/filter states.
3. Upgrade one featured case study to the complete evidence model.
4. Recompose Resume for scanning and print.
5. Simplify Hire intent and progressive form disclosure.

Checkpoint: Home -> project -> Resume/Hire works with keyboard, touch, and both locales.

### Phase C: Credibility surfaces

1. Apply the evidence model to remaining case studies.
2. Replace About and Lab fallback imagery with real assets.
3. Add article-specific visual language and article navigation.
4. Align Contact with the final conversion vocabulary.

Checkpoint: no visible claim lacks evidence, state, or a clear owner-editable source.

### Phase D: Motion, resilience, and release quality

1. Replace generic reveal repetition with route-specific motion patterns.
2. Complete loading, empty, error, success, offline, and slow-network states.
3. Run accessibility, responsive, performance, SEO, and content-truth audits.
4. Validate analytics events for the primary conversion funnel.
5. Produce final desktop/mobile screenshots and update documentation.

Checkpoint: production build passes and no P0/P1 UX finding remains.

## Definition of done

- A visitor reaches a relevant case study, CV, or Hire flow in one click from every primary route.
- A recruiter can find role, availability, strongest proof, experience, and contact within 20 seconds on Resume.
- Every featured project contains real responsibility, constraints, decisions, evidence, and outcome.
- No heading overflows at supported breakpoints and display text never exceeds the approved ceiling.
- Kicker count is at most one per three sections.
- CTA intent is consistent and not duplicated on a page.
- No Lab or Journal image misrepresents its content.
- Keyboard, screen-reader landmarks, zoom, reduced motion, print, and 320px layouts pass.
- LCP is below 2.5s, CLS below 0.1, and no interaction produces a console error.
- Vietnamese and English have equivalent information and complete states.
- Admin can edit every public proof item and asset without a source change.

## Owner inputs required before final content polish

1. Actual CV PDF or confirmation that print-to-PDF is the permanent download method.
2. The strongest verified result for each featured project.
3. Real covers or source material for each Lab item.
4. Final engagement modes and public availability statement.
