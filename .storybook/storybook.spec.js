// From https://www.npmjs.com/package/@storybook/addon-storyshots-puppeteer

import initStoryshots from "@storybook/addon-storyshots";
import { axeTest } from "@storybook/addon-storyshots-puppeteer";

initStoryshots({ suite: "A11y checks", test: axeTest() });
