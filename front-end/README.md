# Treeframe

Turn any public GitHub repository into an animated folder map for your README.

```md
[![Treeframe](https://YOUR-SITE/api/map?repo=owner/repo)](https://YOUR-SITE/r/owner/repo)
```

## Project layout

```
treeframe/
├── svgGen/       Pure TypeScript library. Entries + config in, SVG string out. No I/O, no framework.
│   └── src/
│       ├── domain/    Types shared by every layer
│       ├── config/    Defaults, sanitizing and merging of config layers
│       ├── theme/     Color themes
│       ├── tree/      Entries -> filtered, sorted, described, colored tree
│       ├── layout/    Tree -> rows, coordinates, canvas size
│       └── render/    Layout -> SVG markup
└── front-end/    Next.js app (Vercel)
    └── src/
        ├── server/    GitHub client, services, HTTP helpers
        ├── app/       Pages and API routes (thin: parse, call service, respond)
        ├── features/  Visual editor
        └── lib/       Small shared helpers
```

Data flow: `GitHub API -> server/services -> svgGen -> /api/map (image/svg+xml)`.

## Run it

```bash
npm install
cp front-end/.env.example front-end/.env.local   # add a GITHUB_TOKEN
npm run dev                                      # http://localhost:3000
npm test                                         # svgGen unit tests
```

## `.treeframe.json`

Commit it to the repo root. Every field is optional.

```json
{
  "title": "my-project",
  "depth": 3,
  "theme": "dark",
  "showFiles": true,
  "showComments": true,
  "ignore": ["legacy", "*.snap"],
  "hide": ["src/internal"],
  "descriptions": { "src/api": "External API integrations" },
  "colors": { "src/api": "#ffe14a" }
}
```

Without the file the map is generated automatically, with default ignores (`node_modules`, `dist`, lockfiles...) and default descriptions (`src` = "Source code", ...).

## Query options on `/api/map`

`repo`, `branch`, `depth`, `theme` (`dark`|`light`), `title`, `files=0`, `comments=0`. They override the repo file.

## Notes

- Config files are untrusted input: values are validated and everything is XML-escaped before reaching the SVG.
- Responses use `s-maxage=3600`. GitHub's image proxy (camo) caches as well, so updates can take a while to show up.
- Private repositories are out of scope for v1.
