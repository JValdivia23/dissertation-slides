# Local Slidev AI resources

This project uses Slidev 53.0.0 and npm. The official Slidev skill bundled with
`@slidev/cli` is copied to [`.opencode/skills/slidev/`](../.opencode/skills/slidev/).
Its `SKILL.md` indexes local references for syntax, layouts, animations, math,
exporting, and hosting. Some upstream examples use pnpm; use this project's npm
scripts instead. The skill is MIT-licensed and comes from
[`slidevjs/slidev`](https://github.com/slidevjs/slidev/tree/v53.0.0/skills/slidev).

## MCP server

Slidev's MCP server is built into `@slidev/cli`. The project-local
[`opencode.jsonc`](../opencode.jsonc) starts it over stdio against `slides.md`;
it does not need a separate MCP package or a running preview. After `npm ci`,
open OpenCode in this directory and check the `slidev` connection with
`opencode mcp list` or `/mcps`.

The MCP tools can inspect slides, update content and notes, and insert, remove,
or reorder slides. The live navigation tool is available only through the
dev-server MCP endpoint. For a live preview, run `npm run dev` and connect a
separate MCP client to `http://localhost:3030/__mcp` while the server is up.
The configured stdio server is sufficient for file-based slide work.

## Browser verification from OpenCode CLI

The project-local `playwright` MCP server in [`opencode.jsonc`](../opencode.jsonc)
launches the installed Chrome browser at a 1280×720 viewport. It is pinned to
`@playwright/mcp@0.0.82` and is available in OpenCode sessions for this project,
without requiring OpenCode Desktop's experimental browser connection. Check
both MCP connections with `opencode mcp list`.

With `npm run dev` running, use Playwright MCP to navigate to
`http://localhost:3030/<slide-number>`, step through Slidev with `ArrowRight`
and `ArrowLeft`, inspect screenshots and console errors, and revisit slides to
check entry and exit behavior. Follow the additional click and lifecycle checks
in [`manim-web-guide.md`](manim-web-guide.md) for `<CuManim>` slides. Playwright
stores temporary snapshots and screenshots in `.playwright-mcp/`, which is
ignored by Git.

PDF/PNG export is separate from the web build and requires the optional
`playwright-chromium` dependency and browser, which are not installed here.

## References

- [Work with AI](https://sli.dev/guide/work-with-ai)
- [MCP server and tool list](https://sli.dev/features/mcp)
- [Slidev skill and local references](../.opencode/skills/slidev/SKILL.md)
