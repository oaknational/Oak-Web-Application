export const BETA_STAGE = ["beta", "gamma"] as const;
export type BetaStage = typeof BETA_STAGE[number];
