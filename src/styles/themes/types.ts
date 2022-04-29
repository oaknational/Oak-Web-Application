const iconColorOverrides = ["color-icon-bookmarked"] as const;
export type IconColorOverride = typeof iconColorOverrides[number];

const themeVarKeys = [
  ...iconColorOverrides,
  "color-button-primary",
  "color-button-primary-contrast",
  "color-button-secondary",
  "color-button-secondary-contrast",
  "color-button-tertiary",
  "color-button-tertiary-contrast",
] as const;

type ThemeVarKey = typeof themeVarKeys[number];

export type Theme = Record<ThemeVarKey, string>;
