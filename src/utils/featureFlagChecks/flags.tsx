export const FLAGS = {
  get "example-feature"() {
    return (
      process.env.NEXT_PUBLIC_FORCE_FEATURE_FLAG_EXAMPLE_FEATURE ?? "false"
    );
  },
  get "implementation-guides"() {
    return (
      process.env.NEXT_PUBLIC_FORCE_FEATURE_FLAG_IMPLEMENTATION_GUIDES ?? "true"
    );
  },
  get "case-studies-v2"() {
    return (
      process.env.NEXT_PUBLIC_FORCE_FEATURE_FLAG_CASE_STUDIES_V2 ?? "false"
    );
  },
} as const;
