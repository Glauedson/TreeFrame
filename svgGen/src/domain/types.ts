export type EntryType = 'file' | 'dir';

/** Raw item as returned by a repository source (GitHub, local disk, ...). */
export interface TreeEntry {
  path: string;
  type: EntryType;
}

/** `more` is a synthetic leaf standing for entries hidden by `maxChildren`. */
export type NodeKind = EntryType | 'more';

export interface TreeNode {
  name: string;
  path: string;
  kind: NodeKind;
  depth: number;
  children: TreeNode[];
  description?: string;
  color?: string;
}

export type ThemeName = 'dark' | 'light';

/** Contents of a `.treeframe.json` file, after defaults were applied. */
export interface TreeframeConfig {
  title?: string;
  depth: number;
  theme: ThemeName;
  showFiles: boolean;
  showComments: boolean;
  useDefaultDescriptions: boolean;
  maxChildren: number;
  ignore: string[];
  hide: string[];
  descriptions: Record<string, string>;
  colors: Record<string, string>;
}

export interface Theme {
  background: string;
  border: string;
  line: string;
  icon: string;
  name: string;
  comment: string;
  commentActive: string;
  rowHover: string;
  root: string;
  palette: string[];
}

export interface GeneratedSvg {
  svg: string;
  width: number;
  height: number;
}
