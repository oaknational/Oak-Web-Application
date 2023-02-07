// https://nextjs.org/docs/advanced-features/security-headers

const getCspReportUri = (dataDogClientToken) => {
  // Without an intermediate end-point this means exposing the client token to the browser as header content.
  // The keys can be used to submit data and events.
  // We might be able to use tags to distinguish between
  // deployment environments, e.g. PR and production.
  const ddTags = "owa-csp";
  // Note, if we have DataDog RUM turned on we don't need to configure this endpoint,
  // the reports would be collected automatically.
  return `https://csp-report.browser-intake-datadoghq.eu/api/v2/logs?dd-api-key=${dataDogClientToken}&dd-evp-origin=content-security-policy&ddsource=csp-report&ddtags=${ddTags}`;
};

const getContentSecurityPolicy = ({
  isNextjsDevelopmentServer,
  dataDogClientToken,
}) =>
  `
frame-ancestors
 'self';
block-all-mixed-content;
default-src
 'self';
script-src
 'self'
 'report-sample'
 ${
   // Need this for injected Cloudflare scripts.
   // Is there a better way?
   "'unsafe-inline'"
 }
 ${
   // Need this for auto-reload scripts etc.
   isNextjsDevelopmentServer ? "'unsafe-eval'" : ""
 }
 https://config.thenational.academy
 https://consent-manager.thenational.academy
 https://forms.hsforms.com
 https://*.hs-analytics.net
 https://*.hs-banner.com
 https://*.hs-scripts.com
 https://*.hs-scripts.com
 https://*.hsadspixel.net
 https://*.hscollectedforms.net
 https://*.hsforms.net
 https://*.hsleadflows.net
 https://*.hubspotfeedback.com
 https://*.usemessages.com
 https://static.cloudflareinsights.com;
style-src
 'self'
 'report-sample'
 'unsafe-inline'
 googleapis-fonts.thenational.academy;
object-src
 'none';
frame-src
 'self'
 *.hubspot.com
 forms.hsforms.com
 js.hsadspixel.net
 js.hscollectedforms.net
 js.usemessages.com;
child-src
 'self'
 app.hubspot.com
 forms.hsforms.com
 js.hsadspixel.net
 js.hscollectedforms.net
 js.usemessages.com;
img-src
 'self'
 *.hubspot.com
 cdn2.hubspot.net
 fonts.gstatic.com
 forms.hsforms.com
 sanity-asset-cdn.thenational.academy;
font-src
 'self'
 data:
 gstatic-fonts.thenational.academy;
connect-src
 'self'
 *.thenational.academy
 *.hubspot.com
 api.avo.app
 api.hubapi.com
 cloudflareinsights.com
 forms.hsforms.com
 js.hs-analytics.net
 js.hs-banner.com
 js.hs-scripts.com
 js.hsadspixel.net
 js.hsleadflows.net
 js.hubspotfeedback.com
 js.usemessages.com;
manifest-src
 'self';
base-uri
 'self';
form-action
 'self'
 forms.hsforms.com
 forms.hubspot.com;
media-src
 'self';
prefetch-src
 'self';
worker-src
 'self';
upgrade-insecure-requests;
${
  // Only enable CSP violation reporting if the token has been supplied.
  dataDogClientToken ? `report-uri ${getCspReportUri(dataDogClientToken)};` : ""
}
`
    .replace(/\s+/g, " ")
    .trim();

// https://www.permissionspolicy.com/
const getPermissionPolicy = () =>
  `
accelerometer=(),
ambient-light-sensor=(),
autoplay=(),
battery=(),
camera=(),
cross-origin-isolated=(),
display-capture=(),
document-domain=(),
encrypted-media=(),
execution-while-not-rendered=(),
execution-while-out-of-viewport=(),
fullscreen=(),
geolocation=(),
gyroscope=(),
keyboard-map=(),
magnetometer=(),
microphone=(),
midi=(),
navigation-override=(),
payment=(),
picture-in-picture=(),
publickey-credentials-get=(),
screen-wake-lock=(),
sync-xhr=(),
usb=(),
web-share=(),
xr-spatial-tracking=()
`
    .replace(/\s+/g, " ")
    .trim();

// https://nextjs.org/docs/advanced-features/security-headers
/**
 * Generate security headers.
 * @param {boolean} isDevServer Flag for if this is a local dev server.
 * @returns {Array<{key: string, value: string}>} The security header keys and values.
 */
const getSecurityHeaders = ({
  isNextjsDevelopmentServer,
  dataDogClientToken,
}) => {
  if (
    !dataDogClientToken ||
    dataDogClientToken === "" ||
    dataDogClientToken === "undefined"
  ) {
    console.warn("CSP reporting disabled in this environment.");
    // DEBUG
    throw new Error(
      "Please specific a client token for CSP violation reporting"
    );
  }
  const headerArray = [
    {
      key: "X-DNS-Prefetch-Control",
      value: "on",
    },
    {
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    },
    {
      key: "X-XSS-Protection",
      value: "1; mode=block",
    },
    {
      key: "X-Frame-Options",
      value: "DENY",
    },
    {
      key: "X-Content-Type-Options",
      value: "nosniff",
    },
    {
      key: "Referrer-Policy",
      value: "strict-origin-when-cross-origin",
    },
    // Where a value is specified in both feature policy and permissions policy
    // the permissions policy value will be used.
    {
      key: "Permissions-Policy",
      value: getPermissionPolicy(),
    },
    // CSP report-only for now https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy-Report-Only
    {
      key: "Content-Security-Policy-Report-Only",
      value: getContentSecurityPolicy({
        isNextjsDevelopmentServer,
        dataDogClientToken,
      }),
    },
  ];
  return headerArray;
};

module.exports = { getSecurityHeaders };
