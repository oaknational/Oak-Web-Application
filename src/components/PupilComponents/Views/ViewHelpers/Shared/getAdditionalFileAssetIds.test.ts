import { getAdditionalFileAssetIds } from "./getAdditionalFileAssetIds";

describe("getAdditionalFileAssetIds", () => {
  it("returns asset ids and skips missing files", () => {
    expect(
      getAdditionalFileAssetIds([{ assetId: 1 }, { assetId: "2" }, null]),
    ).toEqual([1, 2]);
  });

  it("returns an empty array when there are no additional files", () => {
    expect(getAdditionalFileAssetIds(null)).toEqual([]);
    expect(getAdditionalFileAssetIds(undefined)).toEqual([]);
  });
});
