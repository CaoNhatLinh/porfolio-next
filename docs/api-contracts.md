# API and interface contracts

## Boundary choice

Public content is read directly in Server Components through server-only query functions. Do not add REST endpoints merely to call the same Next.js server from itself.

Route Handlers are limited to boundaries that need HTTP:

- Supabase Auth browser/server client calls (there is no local `/api/auth/*` proxy)
- `POST /api/analytics/events`
- `GET|POST /api/analytics/rollup` (Vercel Cron only, `CRON_SECRET`)
- `POST /api/contact`
- `POST|DELETE /api/uploads`

Admin mutations use Server Actions and must authenticate and validate inside every action.

Private preview routes are server-rendered pages, not public content endpoints:

- `GET /preview/projects/:id`
- `GET /preview/articles/:id`

Both require the owner session, query by the record id with the service-role client, and send `noindex, nofollow` metadata. Public repository queries only include `PUBLISHED` records, so a draft cannot leak through the sitemap or public slug routes.

## Shared results

```ts
type ActionResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      error: {
        code: "VALIDATION_ERROR" | "UNAUTHORIZED" | "NOT_FOUND" | "CONFLICT" | "INTERNAL_ERROR";
        message: string;
        fieldErrors?: Record<string, string[]>;
      };
    };
```

## Project commands

- `createProject(input): Promise<ActionResult<ProjectEditorDto>>`
- `updateProject(id, input, expectedUpdatedAt): Promise<ActionResult<ProjectEditorDto>>`
- `setProjectFeatured(id, isFeatured, featuredOrder): Promise<ActionResult<ProjectListItemDto>>`
- `reorderProjects(orderedIds): Promise<ActionResult<void>>`
- `publishProject(id): Promise<ActionResult<ProjectListItemDto>>`
- `archiveProject(id): Promise<ActionResult<void>>`
- `createArticle(input): Promise<ActionResult<ArticleEditorDto>>`
- `updateArticle(id, input, expectedUpdatedAt): Promise<ActionResult<ArticleEditorDto>>`
- `archiveArticle(id): Promise<ActionResult<void>>`

List queries accept `page`, `pageSize`, `status`, `category`, `isFeatured`, `sortBy`, and `sortOrder`. Defaults are stable and documented.

## Contact contract

Input: `intent` (`general`, `hire`, or `speaking`), `name`, `email`, `project`, optional `timeline`, optional `budgetRange`, optional `website`, optional message, honeypot, and form-start timestamp.

Responses:

- `201`: accepted.
- `422`: structured field validation.
- `429`: rate limited.
- `500`: generic public error without internal details.

## Analytics contract

Input: `eventName` (for example `page_view`, `resume_view`, `resume_download`, `resume_print`, `hire_start`, `hire_submit`, or `contact_submit`), normalized `path`, optional referrer, generated anonymous visitor token, and viewport category. The server derives or validates device and location data. Never accept admin metrics from the client.

The endpoint returns `202` with no detailed body so tracking never blocks navigation.

## Upload contract

- Authenticate before issuing an upload token.
- Allow only approved image MIME types and size limits.
- Persist width, height, MIME type, storage key, and alt text.
- Deleting a database record does not immediately delete shared media. A cleanup job removes unreferenced assets.
