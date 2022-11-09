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
      "Blog"
    );
    const expectedCrumbs = [
      {
        label: "Blog",
        href: "/blog",
      },
      {
        label: "Research and insights",
        href: "research-and-insights",
        disabled: true,
      },
    ];

    expect(breadcrumbs).toEqual(expectedCrumbs);
  });

  test("passed a category list but NO slug it still returns breadcrumbs array with All as the last slug", () => {
    const breadcrumbs = getBlogWebinarListBreadcrumbs(
      categories,
      null,
      "beta/webinars",
      "Webinars"
    );
    const expectedCrumbs = [
      {
        label: "Webinars",
        href: "/beta/webinars",
      },
      {
        label: "All",
        href: "/beta/webinars",
        disabled: true,
      },
    ];

    expect(breadcrumbs).toEqual(expectedCrumbs);
  });
});
