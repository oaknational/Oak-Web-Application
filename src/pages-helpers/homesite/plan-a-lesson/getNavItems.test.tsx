import { getNavItems } from "./getNavItems";

import { testPlanALessonPageData } from "@/__tests__/pages/lesson-planning.fixture";

describe("getNavItems function", () => {
  it("should return valid navigation items excluding form items", () => {
    const result = getNavItems({ pageData: testPlanALessonPageData });
    expect(result).toEqual([
      { title: "test nav content", href: "#test-nav-content" },
      { title: "test content 2", href: "#test-content-2" },
    ]);
  });
});
