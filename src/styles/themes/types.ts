const themeVarKeys = [
  "color-teachers-primary",
  "color-teachers-primary-contrast",
  "color-teachers-secondary",
  "color-teachers-secondary-contrast",
  "color-pupils-primary",
  "color-pupils-primary-contrast",
  "color-pupils-secondary",
  "color-pupils-secondary-contrast",
] as const;

type ThemeVarKey = typeof themeVarKeys[number];

export type Theme = Record<ThemeVarKey, string>;
