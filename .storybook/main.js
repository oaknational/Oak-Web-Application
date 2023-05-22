module.exports = {
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
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-css-modules-preset",
    "storybook-addon-themes",
    "@storybook/addon-storysource",
    "@storybook/addon-a11y",
    "@storybook/addon-mdx-gfm",
    "storybook-addon-next",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  staticDirs: ["../public"],
  webpackFinal: async (config) => {
    config.module.rules = [
      ...config.module.rules.map((rule) => {
        if (/svg/.test(rule.test)) {
          // Silence the Storybook loaders for SVG files
          return { ...rule, exclude: /\.svg$/i };
        }

        return rule;
      }),
      // Add your custom SVG loader
      {
        test: /\.svg$/i,
        use: ["@svgr/webpack"],
      },
    ];

    return config;
  },
  fallback: {
    querystring: require.resolve("querystring-es3"),
    path: require.resolve("path-browserify"),
    buffer: require.resolve("buffer/"),
    crypto: require.resolve("crypto-browserify"),
    http: require.resolve("stream-http"),
    stream: require.resolve("stream-browserify"),
    url: require.resolve("url/"),
    util: require.resolve("util/"),
  },

  docs: {
    autodocs: true,
  },
};
