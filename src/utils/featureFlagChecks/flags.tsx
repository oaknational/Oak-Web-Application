export const FLAGS = {
  get "implementation-guides"() {
    return (
      process.env.NEXT_PUBLIC_FORCE_FEATURE_FLAG_IMPLEMENTATION_GUIDES ??
      "false"
    );
  },
} as const;
