export class AppError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

export const invalidRepo = () => new AppError('Use a repository like "owner/name" or a github.com URL.', 400);
export const repoNotFound = () => new AppError('Repository not found. Only public repositories are supported.', 404);
export const rateLimited = () => new AppError('GitHub rate limit reached. Try again in a few minutes.', 429);
