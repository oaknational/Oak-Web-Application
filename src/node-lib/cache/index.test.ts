/**
 * @jest-environment node
 */
import { cacheLife, cacheTag } from "next/cache";

import { applyCachePolicy } from ".";

jest.mock("next/cache", () => ({
  cacheLife: jest.fn(),
  cacheTag: jest.fn(),
}));

const mockCacheLife = jest.mocked(cacheLife);
const mockCacheTag = jest.mocked(cacheTag);

describe("applyCachePolicy", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("applies the default revalidation period", () => {
    applyCachePolicy();

    expect(mockCacheLife).toHaveBeenCalledWith({ revalidate: 7200 });
    expect(mockCacheTag).not.toHaveBeenCalled();
  });

  it("applies custom revalidation and tags", () => {
    applyCachePolicy({ revalidate: 60, tags: ["programme", "curriculum"] });

    expect(mockCacheLife).toHaveBeenCalledWith({ revalidate: 60 });
    expect(mockCacheTag).toHaveBeenCalledWith("programme", "curriculum");
  });
});
