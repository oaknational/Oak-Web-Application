import { renderHook } from "@testing-library/react-hooks";

import { mockWebinar } from "../../../__tests__/pages/webinars/webinar.fixtures";

import useUpcomingWebinarWall from "./useUpcomingWebinarWall";

describe("useUpcomingWebinarWall.ts", () => {
  test("returns the expected data", () => {
    const { result } = renderHook(() => useUpcomingWebinarWall(mockWebinar()));

    expect(result.current).toMatchObject({
      headingText: "Starts at 14 April 2020 at 14:00 (UK time)",
      buttonHref: "https://share.hsforms.com/1USsrkazESq2Il8lxUx_vPgbvumd",
      buttonText: "Save my place",
      buttonSuffixA11y: "on the webinar",
    });
  });
});
