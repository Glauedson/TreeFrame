import type { TreeframeConfig } from '../domain/types';

export const DEFAULT_IGNORE: readonly string[] = [
  'node_modules', '.git', '.github', '.next', '.nuxt', '.turbo', '.cache', '.vercel',
  '.idea', '.vscode', '.DS_Store', '__pycache__', '.venv', 'venv', 'dist', 'build',
  'out', 'coverage', 'target', '*.lock', 'package-lock.json', 'pnpm-lock.yaml', 'bun.lockb',
];

/** Fallback descriptions for common names, used when the owner wrote none. */
export const DEFAULT_DESCRIPTIONS: Readonly<Record<string, string>> = {
  src: 'Source code',
  public: 'Static files served as-is',
  assets: 'Static application assets',
  components: 'Reusable UI components',
  pages: 'Application pages and routes',
  app: 'Application entry and routes',
  api: 'API layer',
  lib: 'Shared libraries',
  utils: 'Utility helpers',
  hooks: 'Custom hooks',
  styles: 'Global and shared styles',
  config: 'Configuration files',
  scripts: 'Automation scripts',
  tests: 'Automated tests',
  test: 'Automated tests',
  __tests__: 'Automated tests',
  docs: 'Documentation',
  examples: 'Usage examples',
  types: 'Type definitions',
  services: 'Business and integration services',
  models: 'Data models',
  controllers: 'Request handlers',
  middleware: 'Request middleware',
  'package.json': 'Project manifest and scripts',
  'README.md': 'Project overview',
};

/** Directories whose children each get their own branch color. */
export const SPLIT_COLOR_DIRS: readonly string[] = ['src', 'packages', 'apps'];

export const DEFAULT_CONFIG: TreeframeConfig = {
  depth: 3,
  theme: 'dark',
  showFiles: true,
  showComments: true,
  useDefaultDescriptions: true,
  maxChildren: 12,
  ignore: [],
  hide: [],
  descriptions: {},
  colors: {},
};

export const LIMITS = {
  depth: { min: 1, max: 6 },
  maxChildren: { min: 1, max: 40 },
  descriptionLength: 80,
} as const;
