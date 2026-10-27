import { act, renderHook, waitFor } from "@testing-library/react";
import { SWRConfig } from "swr";
import { type ReactNode } from "react";

import { useGetEducatorData } from "./useGetEducatorData";

import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { mockLoggedIn, mockLoggedOut } from "@/__tests__/__helpers__/mockUser";

const url = "/api/educator/getSavedUnits/programme";
const fetchMock = jest.mocked(global.fetch);

jest.unmock("./useGetEducatorData");

function createWrapper() {
  const cache = new Map();
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <SWRConfig value={{ provider: () => cache, shouldRetryOnError: false }}>
        {children}
      </SWRConfig>
    );
  };
}

describe("useGetEducatorData cache isolation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setUseUserReturn(mockLoggedIn);
  });

  it("does not reuse another user's cached data for the same URL", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(["user-a-unit"])),
    );
    const { result, rerender } = renderHook(
      () => useGetEducatorData<string[]>(url),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.data).toEqual(["user-a-unit"]));

    let finishRequest!: (response: Response) => void;
    fetchMock.mockImplementationOnce(
      () =>
        new Promise<Response>((resolve) => {
          finishRequest = resolve;
        }),
    );
    setUseUserReturn({
      ...mockLoggedIn,
      user: { ...mockLoggedIn.user, id: "another-user" },
    });
    rerender();

    expect(result.current.data).toBeUndefined();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    await act(async () => {
      finishRequest(new Response(JSON.stringify(["user-b-unit"])));
    });
    await waitFor(() => expect(result.current.data).toEqual(["user-b-unit"]));
    expect(fetchMock.mock.calls.map(([requestUrl]) => requestUrl)).toEqual([
      url,
      url,
    ]);
  });

  it("reuses the same user's cache on remount", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(["saved-unit"])),
    );
    const wrapper = createWrapper();
    const first = renderHook(() => useGetEducatorData<string[]>(url), {
      wrapper,
    });
    await waitFor(() =>
      expect(first.result.current.data).toEqual(["saved-unit"]),
    );
    first.unmount();

    const second = renderHook(() => useGetEducatorData<string[]>(url), {
      wrapper,
    });

    expect(second.result.current.data).toEqual(["saved-unit"]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("hides cached data and does not fetch after signing out", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(["saved-unit"])),
    );
    const { result, rerender } = renderHook(
      () => useGetEducatorData<string[]>(url),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.data).toEqual(["saved-unit"]));

    setUseUserReturn(mockLoggedOut);
    rerender();

    expect(result.current.data).toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does not fetch before the user identity is available", () => {
    setUseUserReturn({
      user: undefined,
      isLoaded: false,
      isSignedIn: undefined,
    });
    const { result } = renderHook(() => useGetEducatorData(url), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
