module.exports = {
  async getHttpHeaders({ browserContext }) {
    const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET_STORYBOOK;
    if (bypass) {
      return { "x-vercel-protection-bypass": bypass };
    }
    return {};
  },
};
