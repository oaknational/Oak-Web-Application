export const FLAGS = {
  get "example-feature"() {
    return (
      process.env.NEXT_PUBLIC_FORCE_FEATURE_FLAG_EXAMPLE_FEATURE ?? "false"
    );
  },
  get "nc-alignment-checker"() {
    return (
      process.env.NEXT_PUBLIC_FORCE_FEATURE_FLAG_NC_ALIGNMENT_CHECKER ?? "false"
    );
  },
  get "schools-journey"() {
    return (
      process.env.NEXT_PUBLIC_FORCE_FEATURE_FLAG_SCHOOLS_JOURNEY ?? "false"
    );
  },
} as const;
