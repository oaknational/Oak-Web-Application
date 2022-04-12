/**
 * Configure Percy
 * https://docs.percy.io/docs/cli-configuration#a-complete-config
 *
 * Note: Percy is triggered in Github workflows, the logic is here .github/actions/percy_snapshots/index.js
 */
module.exports = {
  version: 2,
  snapshot: {
    widths: [375, 1280],
    minHeight: 1024,
    percyCSS: "",
  },
  discovery: {
    allowedHostnames: [],
    userAgent: "Percy",
  },
};
