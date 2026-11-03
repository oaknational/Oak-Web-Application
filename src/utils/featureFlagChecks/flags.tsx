export const FLAGS = {
  get "example-feature"() {
    return (
      process.env.NEXT_PUBLIC_FORCE_FEATURE_FLAG_EXAMPLE_FEATURE ?? "false"
    );
  },
  get "join-research-panel"() {
    return (
      process.env.NEXT_PUBLIC_FORCE_FEATURE_FLAG_JOIN_RESEARCH_PANEL ?? "false"
    );
  },
  get "nc-alignment-checker"() {
    return (
      process.env.NEXT_PUBLIC_FORCE_FEATURE_FLAG_NC_ALIGNMENT_CHECKER ?? "false"
    );
  },
} as const;
