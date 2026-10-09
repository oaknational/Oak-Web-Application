export const FLAGS = {
  get "example-feature"() {
    return (
      process.env.NEXT_PUBLIC_FORCE_FEATURE_FLAG_EXAMPLE_FEATURE ?? "false"
    );
  },
  get "case-studies-v2"() {
    return process.env.NEXT_PUBLIC_FORCE_FEATURE_FLAG_CASE_STUDIES_V2 ?? "true";
  },
  get "join-research-panel"() {
    return (
      process.env.NEXT_PUBLIC_FORCE_FEATURE_FLAG_JOIN_RESEARCH_PANEL ?? "false"
    );
  },
} as const;
