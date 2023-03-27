module.exports = {
  core: {
    builder: "webpack5",
  },
  env: (config) => ({
    ...config,
    NEXT_PUBLIC_CLIENT_APP_BASE_URL: "http://localhost:3000",
    NEXT_PUBLIC_APP_VERSION: "123",
    NEXT_PUBLIC_RELEASE_STAGE: "test",
    NEXT_PUBLIC_SEARCH_API_URL: "NEXT_PUBLIC_SEARCH_API_URL",
    NEXT_PUBLIC_GRAPHQL_API_URL: "NEXT_PUBLIC_GRAPHQL_API_URL",
    NEXT_PUBLIC_BUGSNAG_API_KEY: "NEXT_PUBLIC_BUGSNAG_API_KEY",
    NEXT_PUBLIC_HUBSPOT_PORTAL_ID: "NEXT_PUBLIC_HUBSPOT_PORTAL_ID",
    NEXT_PUBLIC_HUBSPOT_FALLBACK_FORM_ID:
      "NEXT_PUBLIC_HUBSPOT_FALLBACK_FORM_ID",
    NEXT_PUBLIC_HUBSPOT_NEWSLETTER_FORM_ID:
      "NEXT_PUBLIC_HUBSPOT_NEWSLETTER_FORM_ID",
    NEXT_PUBLIC_HUBSPOT_SCRIPT_DOMAIN: "NEXT_PUBLIC_HUBSPOT_SCRIPT_DOMAIN",
    NEXT_PUBLIC_POSTHOG_API_HOST: "NEXT_PUBLIC_POSTHOG_API_HOST",
    NEXT_PUBLIC_POSTHOG_API_KEY: "NEXT_PUBLIC_POSTHOG_API_KEY",
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_SANITY_ASSET_CDN_HOST:
      process.env.NEXT_PUBLIC_SANITY_ASSET_CDN_HOST,
    NEXT_PUBLIC_GLEAP_API_KEY: "NEXT_PUBLIC_GLEAP_API_KEY",
    NEXT_PUBLIC_GLEAP_API_URL: "NEXT_PUBLIC_GLEAP_API_URL",
    NEXT_PUBLIC_GLEAP_FRAME_URL: "NEXT_PUBLIC_GLEAP_FRAME_URL",
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
