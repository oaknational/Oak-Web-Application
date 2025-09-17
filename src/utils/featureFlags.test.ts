import { renderHook } from "@testing-library/react";

import { useFeatureFlag } from "./featureFlags";

import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";

jest.mock("@/node-lib/posthog/getFeatureFlag");

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
    (getFeatureFlag as jest.Mock).mockResolvedValue(true);
    const { result } = renderHook(() => useFeatureFlag("foo"));
    expect(await result.current).toEqual(true);
  });

  test("does not exist", async () => {
    getAllCookiesMock.mockReturnValue([]);
    (getFeatureFlag as jest.Mock).mockResolvedValue(true);
    const { result } = renderHook(() => useFeatureFlag("foo"));
    expect(await result.current).toEqual(undefined);
  });

  test("string assertion with valid type", async () => {
    getAllCookiesMock.mockReturnValue([
      {
        name: "ph_NEXT_PUBLIC_POSTHOG_API_KEY_posthog",
        value: JSON.stringify({ distinct_id: "1111" }),
      },
    ]);
    (getFeatureFlag as jest.Mock).mockResolvedValue("testing");
    const { result } = renderHook(() => useFeatureFlag("foo", "string"));
    expect(await result.current).toEqual("testing");
  });

  test("string assertion with invalid type", async () => {
    getAllCookiesMock.mockReturnValue([
      {
        name: "ph_NEXT_PUBLIC_POSTHOG_API_KEY_posthog",
        value: JSON.stringify({ distinct_id: "1111" }),
      },
    ]);
    (getFeatureFlag as jest.Mock).mockResolvedValue(true);
    const { result } = renderHook(() => useFeatureFlag("foo", "string"));
    expect(await result.current).toEqual(undefined);
  });

  test("boolean assertion with valid type", async () => {
    getAllCookiesMock.mockReturnValue([
      {
        name: "ph_NEXT_PUBLIC_POSTHOG_API_KEY_posthog",
        value: JSON.stringify({ distinct_id: "1111" }),
      },
    ]);
    (getFeatureFlag as jest.Mock).mockResolvedValue(true);
    const { result } = renderHook(() => useFeatureFlag("foo", "boolean"));
    expect(await result.current).toEqual(true);
  });

  test("boolean assertion with invalid type", async () => {
    getAllCookiesMock.mockReturnValue([
      {
        name: "ph_NEXT_PUBLIC_POSTHOG_API_KEY_posthog",
        value: JSON.stringify({ distinct_id: "1111" }),
      },
    ]);
    (getFeatureFlag as jest.Mock).mockResolvedValue("test");
    const { result } = renderHook(() => useFeatureFlag("foo", "boolean"));
    expect(await result.current).toEqual(undefined);
  });
});
