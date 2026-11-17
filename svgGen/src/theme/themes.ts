import type { Theme, ThemeName } from '../domain/types';

const dark: Theme = {
  background: '#0d1117',
  border: '#30363d',
  line: '#2d343c',
  icon: '#7d8793',
  name: '#c9d1d9',
  comment: '#59636e',
  commentActive: '#aab4bf',
  rowHover: 'rgba(255,255,255,.04)',
  root: '#ffffff',
  palette: ['#3df5ff', '#ff2bd6', '#ffe14a', '#7cff6b', '#ff8a3d', '#6ea8ff', '#b78cff'],
};

const light: Theme = {
  background: '#ffffff',
  border: '#d0d7de',
  line: '#d0d7de',
  icon: '#6e7781',
  name: '#24292f',
  comment: '#8c959f',
  commentActive: '#424a53',
  rowHover: 'rgba(0,0,0,.04)',
  root: '#000000',
  palette: ['#0891b2', '#c026d3', '#ca8a04', '#16a34a', '#ea580c', '#2563eb', '#7c3aed'],
};

const THEMES: Record<ThemeName, Theme> = { dark, light };

export const getTheme = (name: ThemeName): Theme => THEMES[name];
