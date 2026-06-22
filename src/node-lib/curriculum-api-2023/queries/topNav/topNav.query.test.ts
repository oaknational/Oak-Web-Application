import topNavQuery from "./topNav.query";
import { mockResponseData } from "./fixtures";
import { topNavResponseSchema } from "./topNav.schema";

import sdk from "@/node-lib/curriculum-api-2023/sdk";
import { cacheData } from "@/node-lib/cache";
import OakError from "@/errors/OakError";

jest.mock("@/node-lib/curriculum-api-2023/sdk", () => {});

jest.mock("@/node-lib/cache", () => ({
  cacheData: jest.fn((fn) => fn),
}));

const mockCacheData = jest.mocked(cacheData);

const mockErrorReporter = jest.fn();
jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      mockErrorReporter(...args),
}));

describe("TopNavQuery", () => {
  beforeEach(() => {
    mockCacheData.mockImplementation((fn) => fn);
  });

  it("parses mock response data including phase options", () => {
    expect(mockResponseData.phaseOptions).toBeDefined();
    const parsed = topNavResponseSchema.safeParse(mockResponseData);
    expect(parsed.success).toBe(true);
  });

  it("returns the correct data", async () => {
    const res = await topNavQuery({
      ...sdk,
      topNav: jest.fn(() => Promise.resolve(mockResponseData)),
    })();

    expect(res.teachers?.primary.keystages.children).toHaveLength(3);
    expect(res.teachers?.secondary.keystages.children).toHaveLength(2);
    expect(res.pupils?.primary.children).toHaveLength(3);
    expect(res.pupils?.secondary.children).toHaveLength(1);
    expect(
      res.teachers?.primary.keystages.children?.[0]?.children?.[0]?.href,
    ).toBeDefined();
  });

  it("uses the cached topNav function when withCache is true", async () => {
    const mockTopNav = jest.fn(() => Promise.resolve(mockResponseData));
    const mockCachedTopNav = jest.fn(() => Promise.resolve(mockResponseData));
    mockCacheData.mockReturnValue(mockCachedTopNav);

    const res = await topNavQuery({ ...sdk, topNav: mockTopNav })({
      withCache: true,
    });

    expect(mockCacheData).toHaveBeenCalledWith(mockTopNav, [
      "curriculum-api",
      "top-nav-query",
    ]);
    expect(mockCachedTopNav).toHaveBeenCalled();
    expect(mockTopNav).not.toHaveBeenCalled();
    expect(res.teachers?.primary.keystages.children).toHaveLength(3);
    expect(res.teachers?.primary.keystages.children).toHaveLength(3);
  });

  it("reports an error when data is missing", async () => {
    await topNavQuery({
      ...sdk,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      topNav: jest.fn(() => Promise.resolve({ invalidData: [] }) as any),
    })();

    expect(mockErrorReporter).toHaveBeenCalledWith(
      new OakError({
        code: "curriculum-api/internal-error",
      }),
      {
        severity: "error",
        res: { invalidData: [] },
        errorMessage: expect.any(Object),
      },
    );
  });
  it("does not throw an error when data is missing", async () => {
    const res = await topNavQuery({
      ...sdk,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      topNav: jest.fn(() => Promise.resolve({ invalidData: [] }) as any),
    })();

    expect(res).toBeDefined();
    expect(res.teachers).toBeNull();
  });
});
