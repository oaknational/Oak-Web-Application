import {
  insightsAssetIds,
  insightsAssetUrl,
} from "./nationalCurriculumInsightsAssets";

import getBrowserConfig from "@/browser-lib/getBrowserConfig";

jest.mock("@/browser-lib/getBrowserConfig", () => ({
  __esModule: true,
  default: jest.fn((key) =>
    key === "sanityProjectId" ? "test-project" : "test-dataset",
  ),
}));
jest.mock("@/common-lib/urls/getProxiedSanityAssetUrl", () => ({
  __esModule: true,
  default: (url: string) => url,
}));

describe("Insights shared artwork", () => {
  it.each(Object.keys(insightsAssetIds) as (keyof typeof insightsAssetIds)[])(
    "uses the configured content dataset for %s",
    (key) => {
      const url = insightsAssetUrl(key);
      expect(url).toContain("/test-project/test-dataset/");
      expect(url).not.toContain("/production/");
      expect(url).not.toContain("/feat-national-curriculum-insights/");
      expect(getBrowserConfig).toHaveBeenCalledWith("sanityDataset");
    },
  );

  it("keeps the exact JPEG fallback as a file asset", () => {
    expect(insightsAssetUrl("hero")).toBe(
      "https://cdn.sanity.io/files/test-project/test-dataset/c060a0984b0ce355823a8315b1ad9ee9197cd090.jpg",
    );
  });
});
