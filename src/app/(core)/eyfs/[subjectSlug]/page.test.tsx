import EyfsPage from "./page";

const featureFlagMock = jest.fn().mockResolvedValue(false);
jest.mock("@/utils/featureFlags", () => ({
  getFeatureFlagValue: () => featureFlagMock(),
}));

jest.unmock("next/navigation");

describe("Eyfs page", () => {
  it("renders 404 page if feature flag is disabled", async () => {
    await expect(
      EyfsPage({
        params: Promise.resolve({
          subjectSlug: "maths",
        }),
      }),
    ).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });
  it("renders when feature flag is enabled", async () => {
    featureFlagMock.mockResolvedValue(true);
    const result = await EyfsPage({
      params: Promise.resolve({
        subjectSlug: "maths-primary",
      }),
    });

    expect(result).toBeDefined();
  });
});
