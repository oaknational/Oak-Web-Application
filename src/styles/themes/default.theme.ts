import { Theme } from "./types";

// In theory this could be a json passed in as config

const defaultTheme: Theme = {
  common: {
    "button-border-radius": "12px",
    // general theme, which doesn't depend on pupil/teacher
  },
  teachers: {
    "color-primary": "#5C3CCB",
    "color-primary-contrast": "#fff",
    "color-secondary": "#46C7E1",
    "color-secondary-contrast": "#fff",
  },
  pupils: {
    "color-primary": "#96D200",
    "color-primary-contrast": "#371E2D",
    "color-secondary": "#371E2D",
    "color-secondary-contrast": "#fff",
  },
};

export default defaultTheme;
