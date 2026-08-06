export const FLAGS = {
  get "oaks-impact"() {
    return process.env.FORCE_FEATURE_FLAG_OAKS_IMPACT ?? "false";
  },
} as const;
