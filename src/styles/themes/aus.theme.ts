import { Theme } from "./types";

// In theory this could be a json passed in as config
const ausTheme: Theme = {
  common: {
    "button-border-radius": "12px",
    // general theme, which doesn't depend on pupil/teacher
  },
  teachers: {
    "color-primary": "lightgreen",
    "color-primary-contrast": "black",
    "color-secondary": "lightblue",
    "color-secondary-contrast": "black",
  },
  pupils: {
    "color-primary": "darkpurple",
    "color-primary-contrast": "lightgrey",
    "color-secondary": "mauve",
    "color-secondary-contrast": "white",
  },
};

export default ausTheme;
