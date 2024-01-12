import { renderHook } from "@testing-library/react";
import mockRouter from "next-router-mock";

import useIsCurrent from "./useIsCurrent";

vi.mock("next/dist/client/router", () => require("next-router-mock"));

describe("useIsCurrent", () => {
  test.each([
    {
      linkHref: "/lesson-planning",
      currentHref: "http://localhost:3000/lesson-planning?foo=bar#video",
      expected: true,
    },
    {
      linkHref: "/lesson-planning",
      currentHref: "http://localhost:3000/lesson-planning",
      expected: true,
    },
    {
      linkHref: "/about-us",
      currentHref: "http://localhost:3000/about-us/board",
      expected: true,
    },
    {
      linkHref: "/about-us/board",
      currentHref: "http://localhost:3000/about-us",
      expected: false,
    },
    {
      linkHref: "/",
      currentHref: "http://localhost:3000/",
      expected: true,
    },
    {
      linkHref: "/",
      currentHref: "http://localhost:3000/about-us",
      expected: false,
    },
  ])(
    "link href '$linkHref' is not current at '$currentHref'",
    ({ linkHref, currentHref, expected }) => {
      mockRouter.setCurrentUrl(currentHref);

      const { result } = renderHook(() => useIsCurrent({ href: linkHref }));

      expect(result.current).toBe(expected);
    },
  );
});
