export const DOWNLOAD_CATEGORIES = [
  "EYFS",
  "KS1",
  "KS2",
  "KS3",
  "KS4",
  "Therapies",
  "Specialist",
] as const;

export type DownloadCategory = (typeof DOWNLOAD_CATEGORIES)[number];
