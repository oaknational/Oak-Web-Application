const themeUserVarKeys = [
  "color-primary",
  "color-primary-contrast",
  "color-secondary",
  "color-secondary-contrast",
  "color-primary",
  "color-primary-contrast",
  "color-secondary",
  "color-secondary-contrast",
] as const;

const themeCommonVarKeys = ["button-border-radius"] as const;

type ThemeUserVarKey = typeof themeUserVarKeys[number];
type ThemeCommonVarKey = typeof themeCommonVarKeys[number];

export type Theme = {
  common: Record<ThemeCommonVarKey, string>;
  pupils: Record<ThemeUserVarKey, string>;
  teachers: Record<ThemeUserVarKey, string>;
};

// export type Theme = Record<ThemeName, ThemeInterface>;

// theme is record with
