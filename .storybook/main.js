module.exports = {
  env: (config) => ({
    ...config,
    SANITY_ASSET_CDN_HOST: "SANITY_ASSET_CDN_HOST",
    SANITY_PROJECT_ID: "SANITY_PROJECT_ID",
    SANITY_DATASET: "SANITY_DATASET",
  }),
  stories: [
    "../src/components/Intro.stories.mdx",
    "../src/**/*.stories.@(mdx|js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-css-modules-preset",
    "storybook-addon-themes",
    "@storybook/addon-storysource",
    "@storybook/addon-a11y",
    "storybook-addon-next-router",
  ],
  framework: "@storybook/react",
  staticDirs: ["../public"],
  webpackFinal: async (config) => {
    /**
     * Without the below rule, Storybook is completely broken after
     * adding react-portable-text.
     * @see: https://github.com/storybookjs/storybook/issues/16690
     * @see: https://github.com/portabletext/react-portabletext/issues/6
     */
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });

    return config;
  },
};
