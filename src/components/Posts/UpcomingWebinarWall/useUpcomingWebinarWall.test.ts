import { renderHook } from "@testing-library/react";

import { mockWebinar } from "../../../__tests__/pages/webinars/webinar.fixtures";

import useUpcomingWebinarWall from "./useUpcomingWebinarWall";

describe("useUpcomingWebinarWall.ts", () => {
  test("returns the expected data", () => {
    const { result } = renderHook(() => useUpcomingWebinarWall(mockWebinar()));

    expect(result.current).toMatchObject({
      headingText: "Starts at 14 April 2020 at 14:00 (UK time)",
      buttonHref: "https://example.com/webinar-sign-up",
      buttonText: "Save my place",
      buttonSuffixA11y: "on the webinar",
    });
  });
});
