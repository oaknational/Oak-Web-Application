import { getReleaseStage } from "../../scripts/build/build_config_helpers";

type CspConfig = {
  defaultSrc: string[];
  scriptSrc: string[];
  styleSrc: string[];
  imgSrc: string[];
  fontSrc: string[];
  objectSrc: string[];
  baseUri: string[];
  formAction: string[];
  frameAncestors: string[];
  connectSrc: string[];
  mediaSrc: string[];
  frameSrc: string[];
  workerSrc: string[];
  upgradeInsecureRequests: boolean;
};
type CspConfigKey = keyof CspConfig;

const releaseStage = getReleaseStage(
  process.env.OVERRIDE_RELEASE_STAGE ||
    process.env.VERCEL_ENV ||
    // Netlify
    process.env.CONTEXT,
);
const isDevelopment: boolean = releaseStage?.includes("dev");
const isPreview: boolean = releaseStage?.includes("preview");

// Rules
const mux: Partial<CspConfig> = {
  scriptSrc: [
    "https://cdn.mux.com",
    "https://mux.com",
    "https://*.mux.com",
    "https://stream.mux.com",
  ],
  connectSrc: [
    "https://mux.com",
    "https://*.mux.com",
    "https://stream.mux.com",
    "https://inferred.litix.io",
  ],
  imgSrc: ["https://*.mux.com", "https://stream.mux.com"],
  styleSrc: ["https://*.mux.com"],
  mediaSrc: ["https://*.mux.com", "https://stream.mux.com"],
  frameSrc: ["https://stream.mux.com", "https://*.mux.com"],
};

const clerk: Partial<CspConfig> = {
  connectSrc: ["*.clerk.accounts.dev", "clerk-telemetry.com"],
  imgSrc: ["https://img.clerk.com"],
  scriptSrc: ["*.clerk.accounts.dev"],
};

const avo: Partial<CspConfig> = {
  frameSrc: ["https://www.avo.app/"],
  connectSrc: ["https://api.avo.app/"],
};

const posthog: Partial<CspConfig> = {
  connectSrc: ["https://eu.i.posthog.com"],
};

// const cloudinary: Partial<CspConfig> = {
//   imgSrc: [
//     "https://res.cloudinary.com",
//     "https://oaknationalacademy-res.cloudinary.com",
//   ],
// };

const hubspot: Partial<CspConfig> = {
  connectSrc: ["*.hubspot.com"],
  imgSrc: ["https://*.hubspot.com", "https://*.hsforms.com"],
};

const cloudflare: Partial<CspConfig> = {
  frameSrc: ["https://challenges.cloudflare.com"],
};

const vercel: Partial<CspConfig> = {
  scriptSrc: ["https://vercel.live", "https://vercel.com"],
  connectSrc: [
    "https://vercel.live/",
    "https://vercel.com",
    "*.pusher.com",
    "*.pusherapp.com",
  ],
  imgSrc: [
    "https://vercel.live/",
    "https://vercel.com",
    "*.pusher.com/",
    "data:",
    "blob:",
  ],
  frameSrc: ["https://vercel.live/", "https://vercel.com"],
  styleSrc: ["https://vercel.live/"],
  fontSrc: ["https://vercel.live/", "https://assets.vercel.com"],
};

const gleap: Partial<CspConfig> = {
  connectSrc: ["*.gleap.io", "wss://*.gleap.io"],
};

const google: Partial<CspConfig> = {
  connectSrc: ["*.google.com"],
  frameSrc: ["*.google.com"],
  frameAncestors: ["*.google.com"],
};

const bugsnag: Partial<CspConfig> = {
  connectSrc: ["*.bugsnag.smartbear.com", "*.bugsnag.com"],
};

const localhost: Partial<CspConfig> = {
  scriptSrc: ["'unsafe-eval'", "http://localhost:*", "https://localhost:*"],
  frameAncestors: ["http://localhost:*", "https://localhost:*"],
  connectSrc: [
    "http://localhost:*",
    "https://localhost:*",
    "wss://localhost:*",
    "ws://localhost:*",
  ],
};

const cspBaseConfig: CspConfig = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'", "https:", "http:"],
  styleSrc: ["'self'", "'unsafe-inline'"],
  imgSrc: [
    "'self'",
    "blob:",
    "data:",
    "*.thenational.academy",
    "thenational.academy",
  ],
  fontSrc: ["'self'", "gstatic-fonts.thenational.academy", "fonts.gstatic.com"],
  objectSrc: ["'self'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
  frameAncestors: ["'self'"],
  connectSrc: ["*.thenational.academy", "thenational.academy"],
  mediaSrc: ["'self'", "blob:", "*.thenational.academy"],
  frameSrc: ["'self'", "*.thenational.academy"],
  workerSrc: ["'self'", "blob:"],
  upgradeInsecureRequests: false,
  // when we change from report only we can uncomment this
  // upgradeInsecureRequests: !isDevelopment,
};

// Construct CSP headers
const mergeConfigs = (
  fullConfig: CspConfig,
  partialConfig: Partial<CspConfig>,
): CspConfig => {
  const cspConfigKeys: CspConfigKey[] = Object.keys(
    fullConfig,
  ) as CspConfigKey[];

  const entries: [CspConfigKey, CspConfig[CspConfigKey]][] = cspConfigKeys.map(
    (key: CspConfigKey) => {
      if (key === "upgradeInsecureRequests")
        return [key, cspBaseConfig.upgradeInsecureRequests];

      const fullConfigValue = fullConfig[key] ?? [];
      const partialConfigValue = partialConfig[key] ?? [];
      return [key, fullConfigValue.concat(partialConfigValue)];
    },
  );

  return Object.fromEntries(entries) as CspConfig;
};

const cspConfig: CspConfig = [
  isDevelopment ? localhost : {},
  vercel,
  cloudflare,
  hubspot,
  // cloudinary,
  posthog,
  avo,
  clerk,
  mux,
  gleap,
  google,
  bugsnag,
].reduce(mergeConfigs, cspBaseConfig);

// Reporting
const baseUrl = process.env.NEXT_PUBLIC_CLIENT_APP_BASE_URL;
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
const secureBaseUrl = baseUrl?.startsWith("http")
  ? baseUrl.replace("http://", "https://")
  : `https://${baseUrl}`;
const bypassParam =
  isPreview && bypassSecret
    ? `?x-vercel-protection-bypass=${bypassSecret}`
    : "";
const reportCspApiUrl = `${secureBaseUrl}/api/csp-report${bypassParam}`;
export const reportingEndpointsHeader = `oak-csp="${reportCspApiUrl}"`;

export const cspHeader = `
    default-src ${cspConfig.defaultSrc.join(" ")};
    script-src ${cspConfig.scriptSrc.join(" ")};
    style-src ${cspConfig.styleSrc.join(" ")};
    img-src ${cspConfig.imgSrc.join(" ")};
    font-src ${cspConfig.fontSrc.join(" ")};
    object-src ${cspConfig.objectSrc.join(" ")};
    base-uri ${cspConfig.baseUri.join(" ")};
    form-action ${cspConfig.formAction.join(" ")};
    frame-ancestors ${cspConfig.frameAncestors.join(" ")};
    connect-src ${cspConfig.connectSrc.join(" ")};
    media-src ${cspConfig.mediaSrc.join(" ")};
    frame-src ${cspConfig.frameSrc.join(" ")};
    worker-src ${cspConfig.workerSrc.join(" ")};
    report-uri ${reportCspApiUrl};
    report-to oak-csp;
    ${cspConfig.upgradeInsecureRequests ? "upgrade-insecure-requests;" : ""}
`;
