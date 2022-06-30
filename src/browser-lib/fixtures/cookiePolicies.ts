const cookiePolicies = [
  {
    id: "pol:3c779fd2-9d6b-4613-8eed-e746cb669d7e",
    version: 6,
    slug: "strictly-necessary",
    name: "Strictly Necessary",
    description: "Cookies we need to use to keep Oak National Academy secure.",
    required: true,
    // icon: "unknown",
    // isPaused: false,
    // usesCookies: true,
    // allowAnonymous: false,
    // isInitial: true,
    // type: "INFO",
    // usages: [],
    providers: [
      {
        id: "pdr:9b61ee5e-f3c3-4dd0-869d-d5c45da9ea5a",
        name: "CloudFlare",
        privacyUrl: "https://www.cloudflare.com/security-policy/",
        slug: "cloudflare",
      },
    ],
  },
  {
    id: "pol:68beb01a-65f3-481d-b9db-be05ad95c5a1",
    version: 5,
    slug: "embedded-content",
    name: "Embedded Content",
    description:
      "Any cookies required for video or other embedded learning content to work",
    // icon: "media",
    // isPaused: false,
    // usesCookies: true,
    // allowAnonymous: false,
    // isInitial: true,
    // type: "INFO",
    // usages: [],
    providers: [
      {
        id: "pdr:6e35352d-3ca0-4cc8-9521-ced78634293c",
        name: "Mux, Inc.",
        privacyUrl: "https://mux.com/privacy",
        slug: "mux_inc",
      },
      {
        id: "pdr:1c23479b-d47b-43fe-91b1-7943fa63d250",
        name: "Vimeo",
        privacyUrl: "https://vimeo.com/privacy",
        slug: "vimeo",
      },
    ],
  },
  {
    id: "pol:b109d120-ec88-4dd7-9f6e-fc67ab6f0ffb",
    version: 4,
    slug: "statistics",
    name: "Statistics",
    description:
      "Statistics and analytics that allow us to see usage, find bugs and issues, and improve Oak National Academy",
    // icon: "essential",
    // isPaused: false,
    // usesCookies: true,
    // allowAnonymous: false,
    // isInitial: true,
    // type: "OPT_IN",
    // usages: [],
    providers: [
      {
        id: "pdr:b8611acb-d479-4d62-af09-f46284cdb8b1",
        name: "Google Analytics",
        privacyUrl: "http://www.google.com/intl/en/policies/privacy/",
        slug: "google_analytics",
      },
      {
        id: "pdr:b2409901-b822-4f5c-b1a6-9299c5983f7c",
        name: "New Relic",
        privacyUrl: "https://newrelic.com/privacy",
        slug: "new_relic",
      },
      {
        id: "pdr:53e88107-2e19-43bc-99c1-68ac7bede14b",
        name: "BugSnag",
        privacyUrl: "http://docs.bugsnag.com/legal/privacy-policy/",
        slug: "bugsnag",
      },
      {
        id: "pdr:e103a5c9-9a57-44c6-acf6-33f46ce248e9",
        name: "Hotjar",
        privacyUrl: "https://www.hotjar.com/legal/policies/privacy/",
        slug: "hotjar",
      },
      {
        id: "pdr:34faa9e6-0185-477d-b770-a3e34278ded0",
        name: "Hubspot",
        privacyUrl: "https://legal.hubspot.com/privacy-policy",
        slug: "hubspot",
      },
      {
        id: "pdr:c108998e-28bc-42e9-8bb2-5aa24660ad06",
        name: "Gleap",
        privacyUrl: "https://gleap.io/privacy-policy/",
        slug: "gleap",
      },
      {
        id: "pdr:604e4f81-eb75-4cbe-bfbf-6cffd6a6e726",
        name: "Intercom",
        privacyUrl:
          "https://docs.intercom.com/pricing-privacy-and-terms/intercom-inc-privacy-policy",
        slug: "intercom",
      },
    ],
  },
];

export default cookiePolicies;
