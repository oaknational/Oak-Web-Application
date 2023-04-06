import { renderHook } from "@testing-library/react";

import useTrackPageView from "./useTrackPageView";

jest.mock("next/router", () => ({
  __esModule: true,
  ...jest.requireActual("next/router"),
  useRouter: () => ({
    asPath: "/blog",
  }),
}));

const pageView = jest.fn();
jest.mock("../context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      pageView: (...args: unknown[]) => pageView(...args),
    },
  }),
}));

jest.mock("../hooks/../hooks/useAnalyticsUseCase", () => ({
  __esModule: true,
  default: () => ["Teacher"],
}));

describe("useTrackPageView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls tracking pageView function once with correct parameters", () => {
    renderHook(() => useTrackPageView({ pageName: "Blog" }));

    expect(pageView).toHaveBeenCalledTimes(1);
    expect(pageView).toHaveBeenCalledWith({
      linkUrl: "/blog",
      pageName: ["Blog"],
      analyticsUseCase: ["Teacher"],
    });
  });
});
