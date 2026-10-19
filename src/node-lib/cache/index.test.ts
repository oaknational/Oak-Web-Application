/**
 * @jest-environment node
 */
import { cacheLife, cacheTag } from "next/cache";

import { applyCachePolicy, curriculumApiWithCache } from ".";

import curriculumApi from "@/node-lib/curriculum-api-2023";

jest.mock("next/cache", () => ({
  cacheLife: jest.fn(),
  cacheTag: jest.fn(),
}));

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    curriculumOverview: jest.fn(),
    topNav: jest.fn(),
  },
}));

const mockCacheLife = jest.mocked(cacheLife);
const mockCacheTag = jest.mocked(cacheTag);
const mockTopNav = jest.mocked(curriculumApi.topNav);
const mockCurriculumOverview = jest.mocked(curriculumApi.curriculumOverview);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("applyCachePolicy", () => {
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

describe("applyCurriculumQueryCachePolicy", () => {
  it("runs a query without arguments and returns its response", async () => {
    const response = { teachers: null, pupils: null };
    mockTopNav.mockResolvedValueOnce(response);

    const result = await curriculumApiWithCache({
      queryKey: "topNav",
      args: [],
    });

    expect(result).toBe(response);
    expect(mockTopNav).toHaveBeenCalledTimes(1);
    expect(mockTopNav).toHaveBeenCalledWith();
    expect(mockCacheLife).toHaveBeenCalledWith("curriculum");
    expect(mockCacheTag).toHaveBeenCalledWith("curriculum-api");
  });

  it("passes query arguments and preserves additional tags", async () => {
    const args = {
      phaseSlug: "primary",
      subjectSlug: "maths",
      includeNonCurriculum: true,
    };

    await curriculumApiWithCache({
      queryKey: "curriculumOverview",
      args: [args],
      tags: ["programme-page-data"],
    });

    expect(mockCurriculumOverview).toHaveBeenCalledTimes(1);
    expect(mockCurriculumOverview).toHaveBeenCalledWith(args);
    expect(mockTopNav).not.toHaveBeenCalled();
    expect(mockCacheLife).toHaveBeenCalledWith("curriculum");
    expect(mockCacheTag).toHaveBeenCalledWith(
      "curriculum-api",
      "programme-page-data",
    );
  });

  it("applies the global tag when additional tags are empty", async () => {
    await curriculumApiWithCache({
      queryKey: "topNav",
      args: [],
      tags: [],
    });

    expect(mockCacheTag).toHaveBeenCalledWith("curriculum-api");
  });

  it("propagates query errors", async () => {
    const error = new Error("Curriculum query failed");
    mockTopNav.mockRejectedValueOnce(error);

    await expect(
      curriculumApiWithCache({ queryKey: "topNav", args: [] }),
    ).rejects.toBe(error);
  });
});
