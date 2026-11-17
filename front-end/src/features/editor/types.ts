import type { TreeframeConfig } from '@treeframe/svg-gen';

export type EditorConfig = Pick<
  TreeframeConfig,
  'depth' | 'theme' | 'showFiles' | 'showComments' | 'hide' | 'descriptions' | 'colors'
>;

export interface Preview {
  url: string;
  width: number;
  height: number;
}
