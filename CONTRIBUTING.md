# Contributing to Treeframe

Thanks for wanting to help! This guide explains how to set up the project and what a good contribution looks like. By taking part, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to contribute

* **Report a bug** by opening an issue with the repository link that failed, what you expected, and what happened. A copy of your `.treeframe.json` helps a lot.
* **Suggest a feature** by opening an issue first, so we can agree on the idea before you spend time on code.
* **Improve the docs**, fix typos, or add default descriptions for common folder names.
* **Send a pull request** for an existing issue. Issues labeled `good first issue` are a nice place to start.

## Setup

**Requirements:** Node.js 20 or newer.

```bash
git clone https://github.com/Glauedson/TreeFrame.git
cd TreeFrame
npm install
cp front-end/.env.example front-end/.env.local   # add a GITHUB_TOKEN
npm run dev                                      # http://localhost:3000
```

Useful commands:

```bash
npm test             # unit tests of the SVG generator
npm run typecheck    # TypeScript check of both packages
```

## Project structure

The repository has two independent packages:

* `svgGen/` is a pure TypeScript library. It receives a list of paths plus a config and returns an SVG string. It must never depend on the web, the file system or the network.
* `front-end/` is the Next.js website. It fetches data from GitHub, calls `svgGen`, and serves the result.

Data flows in one direction: `GitHub API → server/services → svgGen → /api/map`. See the Architecture section of the [README](README.md) for details.

## Code guidelines

* **Keep layers separate.** Drawing logic goes in `svgGen`, GitHub access goes in `front-end/src/server`, and API routes stay thin (parse input, call a service, return the response).
* **No duplicated code.** If you copy and paste something, extract it. Constants such as pixel values, colors and defaults live in one place.
* **Small, single-purpose modules** and functions with clear names. Prefer a new file over a long one.
* **Strict TypeScript.** Avoid `any`. Treat config files and query parameters as untrusted input and validate them.
* **Security matters.** Anything that ends up inside the SVG must be validated or escaped. Add a test when you touch this area.
* **Tests for the generator.** Changes in `svgGen` should come with a test in `svgGen/tests`.
* **Accessibility.** Keep keyboard navigation, focus styles and `prefers-reduced-motion` working.

## Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org):

```
feat: add light theme
fix: escape XML in descriptions
docs: explain the config file
refactor: extract layout metrics
test: cover the ignore matcher
```

## Pull request process

1. Fork the repository and create a branch from `main`, for example `feat/light-theme`.
2. Make your change, keeping the pull request focused on one thing.
3. Run `npm test` and `npm run typecheck`. Both must pass.
4. If the change affects behavior, update the README or this file.
5. Open the pull request and describe what changed and why. Add a screenshot or a sample SVG when the visual output changed.
6. Respond to review comments. A maintainer will merge once everything is green and approved.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
