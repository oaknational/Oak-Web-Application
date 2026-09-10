import { getBlogWebinarListBreadcrumbs } from "./getBreadcrumbs";

const categories = [
  {
    title: "Curriculum planning",
    slug: "curriculum-planning",
  },
  {
    title: "Lesson planning",
    slug: "lesson-planning",
  },
  {
    title: "Oak updates",
    slug: "oak-updates",
  },
  {
    title: "Research and insights",
    slug: "research-and-insights",
  },
];

describe("getBlogBreadcrumbs", () => {
  test("passed a category list and slug it returns a breadcrumbs array", () => {
    const breadcrumbs = getBlogWebinarListBreadcrumbs(
      categories,
      "research-and-insights",
      "blog",
      "Blog",
    );
    const expectedCrumbs = [
      {
        text: "Blog",
        href: "/blog",
      },
      {
        text: "Research and insights",
      },
    ];

    expect(breadcrumbs).toEqual(expectedCrumbs);
  });

  test("passed a category list but NO slug it still returns breadcrumbs array with All as the last slug", () => {
    const breadcrumbs = getBlogWebinarListBreadcrumbs(
      categories,
      null,
      "webinars",
      "Webinars",
    );
    const expectedCrumbs = [
      {
        text: "Webinars",
        href: "/webinars",
      },
      {
        text: "All",
      },
    ];

    expect(breadcrumbs).toEqual(expectedCrumbs);
  });
});
