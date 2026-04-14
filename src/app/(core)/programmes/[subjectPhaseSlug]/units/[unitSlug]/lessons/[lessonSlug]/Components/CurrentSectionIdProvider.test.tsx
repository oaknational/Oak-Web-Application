import { type ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";

import {
  CurrentSectionIdProvider,
  useCurrentSectionId,
} from "./CurrentSectionIdProvider";

describe("CurrentSectionIdProvider", () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <CurrentSectionIdProvider>{children}</CurrentSectionIdProvider>
  );

  beforeEach(() => {
    window.location.hash = "";
  });

  it("exposes null after mount when there is no hash", async () => {
    const { result } = renderHook(() => useCurrentSectionId(), { wrapper });

    await waitFor(() => {
      expect(result.current).toBeNull();
    });
  });

  it("syncs the fragment from the URL after mount", async () => {
    window.location.hash = "#worksheet";

    const { result } = renderHook(() => useCurrentSectionId(), { wrapper });

    await waitFor(() => {
      expect(result.current).toBe("worksheet");
    });
  });

  it("updates when the hash changes", async () => {
    const { result } = renderHook(() => useCurrentSectionId(), { wrapper });

    await waitFor(() => {
      expect(result.current).toBeNull();
    });

    act(() => {
      window.location.hash = "#quiz";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    await waitFor(() => {
      expect(result.current).toBe("quiz");
    });
  });

  it("treats an empty hash as null", async () => {
    window.location.hash = "#";

    const { result } = renderHook(() => useCurrentSectionId(), { wrapper });

    await waitFor(() => {
      expect(result.current).toBeNull();
    });
  });
});
