/**
 * @jest-environment node
 */
import { cacheLife, cacheTag } from "next/cache";

import appRouterTopNavQuery from "./appRouterTopNav.query";
import { mockResponseData } from "./fixtures";

import sdk from "@/node-lib/curriculum-api-2023/sdk";

jest.unmock("@/node-lib/curriculum-api-2023");
jest.mock("@/node-lib/curriculum-api-2023/sdk", () => ({
  __esModule: true,
  default: { topNav: jest.fn() },
}));

describe("appRouterTopNavQuery", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("caches and returns transformed navigation props", async () => {
    jest.mocked(sdk.topNav).mockResolvedValueOnce(mockResponseData);

    const result = await appRouterTopNavQuery();

    expect(sdk.topNav).toHaveBeenCalledTimes(1);
    expect(result.teachers?.primary.keystages.children).toHaveLength(3);
    expect(result.pupils?.primary.children).toHaveLength(3);
    expect(cacheLife).toHaveBeenCalledWith("curriculum");
    expect(cacheTag).toHaveBeenCalledWith("curriculum-api");
  });

  it("propagates query failures", async () => {
    const error = new Error("Top navigation query failed");
    jest.mocked(sdk.topNav).mockRejectedValueOnce(error);

    await expect(appRouterTopNavQuery()).rejects.toBe(error);
  });
});
