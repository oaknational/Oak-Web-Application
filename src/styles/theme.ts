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

// In theory this could be a json passed in as config
const theme: Theme = {
  // purple
  "color-teachers-primary": "#5C3CCB",
  "color-teachers-primary-contrast": "#fff",
  // light blue
  "color-teachers-secondary": "#46C7E1",
  "color-teachers-secondary-contrast": "#fff",
  // light green
  "color-pupils-primary": "#96D200",
  "color-pupils-primary-contrast": "#371E2D",
  // brown
  "color-pupils-secondary": "#371E2D",
  "color-pupils-secondary-contrast": "#fff",
};

export default theme;
