import { renderHook } from "@testing-library/react";

import { useFeatureFlag } from "./featureFlags";

jest.mock("@/node-lib/posthog/getFeatureFlag", () => ({
  __esModule: true,
  getFeatureFlag: () => true,
}));

const getAllCookiesMock = jest.fn();
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    getAll: (...args: []) => getAllCookiesMock(...args),
  })),
}));

describe("useFeatureFlag", () => {
  test("exists", async () => {
    getAllCookiesMock.mockReturnValue([
      {
        name: "ph_NEXT_PUBLIC_POSTHOG_API_KEY_posthog",
        value: JSON.stringify({ distinct_id: "1111" }),
      },
    ]);
    const { result } = renderHook(() => useFeatureFlag("foo"));
    expect(await result.current).toEqual({ isEnabled: true, flag: true });
  });

  test("does not exist", async () => {
    getAllCookiesMock.mockReturnValue([]);
    const { result } = renderHook(() => useFeatureFlag("foo"));
    expect(await result.current).toEqual({ isEnabled: false, flag: undefined });
  });
});
