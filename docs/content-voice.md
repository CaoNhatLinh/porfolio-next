# Portfolio writing guide

The reader may be a recruiter or an engineer. Make the actual work understandable to both.

- Use first-person Vietnamese with “tôi” for resumes and case studies. “Mình” fits the blog and personal playroom. English is written independently, not translated word for word.
- Start with what was built and the author's role. Explain a technical decision through the problem it solves and its trade-offs.
- Keep established IT terms where they help: frontend, backend, API, state, realtime, transaction, loading, responsive. Explain less familiar terms in context.
- Do not use a section to announce “năng lực thể hiện” or “strength on display”. Describe the implementation; let the reader assess it.
- Do not invent traffic, business impact, production reliability, client feedback, responsibilities, or employer details.
- Distinguish coursework, learning projects, work in progress, and employment. Reconstructed images are illustrations, not evidence of a live deployment.
- Section length follows the information. A button needs a short action; a case study may need several paragraphs. Avoid forced slogans, word counts, and identical storytelling for every project.
- Technical articles should include a concrete situation, an example, its limitations, and checks readers can try. Clearly identify illustrative code; do not imply it shipped in the original project.
- Use slang and emoticons sparingly in informal articles. Avoid them in resumes, error messages, and professional claims.

Examples:

- “Bề mặt thao tác cùng nói một ngôn ngữ” → “Khi đổi chuyến, người dùng cần chọn lại ghế của chuyến mới.”
- “Xem bằng chứng” → “Xem dự án” or “Xem mã nguồn”, depending on the destination.
- “Năng lực thể hiện” → “Phần tôi triển khai” or “Điều tôi học được”.

Updated copy lives in `app/features/content/data.ts`, `resume.ts`, and public route/component labels. Public source articles are intentionally empty; private writing starters are in `article-starters.ts`. See `blog-writing.md` for the blog voice and editor workflow. Supabase content takes precedence when configured; updating source files does not overwrite saved CMS records.
