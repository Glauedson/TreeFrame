/** Markdown that embeds the map in a README and links to the interactive page. */
export const buildReadmeSnippet = (siteUrl: string, repo: string) =>
  `[![Treeframe](${siteUrl}/api/map?repo=${repo})](${siteUrl}/r/${repo})`;
