export const FLAGS = {
  get "oaks-impact"() {
    return process.env.NEXT_PUBLIC_FORCE_FEATURE_FLAG_OAKS_IMPACT ?? "true";
  },
  get "implementation-guides"() {
    return (
      process.env.NEXT_PUBLIC_FORCE_FEATURE_FLAG_IMPLEMENTATION_GUIDES ??
      "false"
    );
  },
} as const;
