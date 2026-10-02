/** Design tokens for the AutoCaption panel. Single source of truth for colors. */
export const colors = {
  background: '#0B0F1A',
  surface: '#131A2A',
  cardBg: '#1B2436',
  border: '#2A3549',
  accentPrimary: '#3B82F6',
  accentSecondary: '#60A5FA',
  accentSuccess: '#22D3AA',
  textPrimary: '#E8ECF4',
  textMuted: '#8B96AD',
  danger: '#F26D6D',
} as const;

export type ColorToken = keyof typeof colors;

/** CSS custom-property map applied on the panel root so SCSS can use var(--c-*). */
export const colorCssVars: Record<string, string> = {
  '--c-background': colors.background,
  '--c-surface': colors.surface,
  '--c-card-bg': colors.cardBg,
  '--c-border': colors.border,
  '--c-accent-primary': colors.accentPrimary,
  '--c-accent-secondary': colors.accentSecondary,
  '--c-accent-success': colors.accentSuccess,
  '--c-text-primary': colors.textPrimary,
  '--c-text-muted': colors.textMuted,
  '--c-danger': colors.danger,
};
