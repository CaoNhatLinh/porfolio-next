# Design system

## Brand lockup

The personal mark is the supplied Kamling logo (`public/brand/kamling-logo.png`). It is rendered through `app/components/brand/brand-logo.tsx` in the public header/footer, admin shell, and login entry. The logo's orange fruit, green leaf, and navy wordmark now anchor the palette (`--accent`, `--brand-green`, and `--accent-ink`). A paper backing is used only on dark surfaces so the navy wordmark keeps sufficient contrast.

## Direction

Public pages use the v3 art direction: technical editorial, tactile materials, asymmetric image-led composition, and varied page rhythms. Admin uses the same brand tokens with calmer product-UI layouts.

Design dials: variance 9, motion 7, density 4.

## Foundations

- Typography: `next/font` only. Use a modern display sans, readable sans body, and restrained mono for metadata.
- Palette: graphite, smoke, off-white, Kamling orange as the primary accent, and leaf green as a restrained secondary brand token.
- Shape rule: public media radius 16 px, controls 999 px only when the pill shape communicates interaction, admin controls 12 px.
- Theme rule: each route has one coherent theme. Home, case study, contact, and admin are dark; Work, About, and Journal are light.
- Grid: 12-column desktop composition, 6-column tablet, strict single column below 768 px.
- Container: maximum 1440 px with fluid page gutters via `clamp()`.

## Token layers

```text
Primitive tokens -> Semantic tokens -> Component tokens -> Page composition
```

Required semantic CSS variables:

```css
:root {
  --surface-canvas: ...;
  --surface-raised: ...;
  --surface-muted: ...;
  --text-primary: ...;
  --text-secondary: ...;
  --border-subtle: ...;
  --accent: ...;
  --accent-contrast: ...;
  --danger: ...;
  --focus-ring: ...;
  --radius-control: 12px;
  --radius-media: 16px;
  --space-page: clamp(1rem, 4vw, 4rem);
}
```

Tailwind utilities consume semantic tokens. Components must not introduce arbitrary hex colors.

For v1, native semantic HTML plus the shared site/admin components cover the primitive behavior. A dedicated primitive package (Dialog, Toast, Skeleton, and richer Field variants) remains on the roadmap rather than adding a component library dependency prematurely.

## Component tiers

1. Primitives: Button, Link, Field, Textarea, Select, Switch, Dialog, Menu, Toast, Skeleton.
2. Brand components: OrbitBackdrop, MaterialImage, EditorialTitle, ProjectMeta, PageTransition.
3. Feature components: ProjectGallery, CaseStudySection, ArticleIndex, AnalyticsChart, ProjectEditor.
4. Page compositions: unique arrangements built from the tiers above. Page compositions are not promoted into generic wrappers prematurely.

## Anti-slop rules

- No three equal marketing cards.
- No repeated section layout family on the same page.
- No fake terminal screenshots, decorative version labels, section numbering, scroll cues, or purple glow.
- Do not put every piece of text in a bordered card.
- Use real project media from Laravel or approved generated assets.
- Maximum one marquee on a page, only when it communicates breadth.
- No animation without a hierarchy, feedback, storytelling, or state purpose.
- Visible copy must not contain em-dash characters.

## Motion

- Use Motion for entry choreography, shared layout transitions, and project image reveals.
- Use CSS transitions for simple hover, focus, and pressed feedback.
- Animate transform and opacity only.
- Never use React state or raw window scroll listeners for continuous scroll values.
- All movement at intensity above 3 must honor `prefers-reduced-motion`.

## Accessibility checklist

- WCAG AA contrast, visible focus, semantic landmarks, skip link, and logical heading order.
- Minimum touch target 44 by 44 px.
- Dialog focus trap and escape behavior come from accessible primitives.
- Form errors connect through `aria-describedby`.
- Project filters remain usable without animation and with keyboard only.
- Decorative 3D/media has empty alt text; meaningful screenshots have useful alt text.
