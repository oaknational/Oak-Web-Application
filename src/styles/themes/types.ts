const iconColorOverrides = ["color-icon-bookmarked"] as const;
export type IconColorOverride = typeof iconColorOverrides[number];

const themeCommonVarKeys = [
  ...iconColorOverrides,
  "color-button-primary",
  "color-button-primary-contrast",
  "color-button-secondary",
  "color-button-secondary-contrast",
  "color-button-tertiary",
  "color-button-tertiary-contrast",
  "button-border-radius",
] as const;
type ThemeCommonVarKey = typeof themeCommonVarKeys[number];

const themeUserVarKeys = [
  "color-primary",
  "color-primary-contrast",
  "color-secondary",
  "color-secondary-contrast",
] as const;
type ThemeUserVarKey = typeof themeUserVarKeys[number];

export type Theme = {
  common: Record<ThemeCommonVarKey, string>;
  pupils: Record<ThemeUserVarKey, string>;
  teachers: Record<ThemeUserVarKey, string>;
};
