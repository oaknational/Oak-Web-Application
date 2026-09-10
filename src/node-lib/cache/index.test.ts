/**
 * @jest-environment node
 */
import { unstable_cache } from "next/cache";

import { cacheData } from ".";

jest.mock("next/cache", () => ({
  unstable_cache: jest.fn(),
}));

const mockUnstableCache = jest.mocked(unstable_cache);

describe("cacheData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("applies default revalidate of 7200 when options are omitted", () => {
    const fn = async () => "result";
    cacheData(fn, ["test-key"]);

    expect(mockUnstableCache).toHaveBeenCalledWith(fn, ["test-key"], {
      revalidate: 7200,
    });
  });

  it("allows overriding revalidate", () => {
    const fn = async () => "result";
    cacheData(fn, ["test-key"], { revalidate: 60, tags: ["cms"] });

    expect(mockUnstableCache).toHaveBeenCalledWith(fn, ["test-key"], {
      revalidate: 60,
      tags: ["cms"],
    });
  });
});
