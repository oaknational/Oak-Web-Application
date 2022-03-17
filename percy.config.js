/**
 * Configure Percy
 * https://docs.percy.io/docs/cli-configuration#a-complete-config
 *
 * Note: Percy is triggered in Github workflows, the logic is here .github/actions/percy_snapshots/index.js
 */

// Vercel JWT auth cookie for password protected deployments, allowed to be empty.
const authCookie = process.env.VERCEL_AUTH_COOKIE || "";

module.exports = {
  version: 2,
  snapshot: {
    widths: [375, 1280],
    minHeight: 1024,
    percyCSS: "",
  },
  discovery: {
    allowedHostnames: [],
    requestHeaders: {
      Cookie: authCookie,
    },
    userAgent: "Percy",
  },
};
