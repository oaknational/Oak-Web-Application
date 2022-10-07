import { getBlogBreadcrumbs } from "./getBlogBreadcrumbs";

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
    const breadcrumbs = getBlogBreadcrumbs(categories, "research-and-insights");
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
    const breadcrumbs = getBlogBreadcrumbs(categories, null);
    const expectedCrumbs = [
      {
        label: "Blog",
        href: "/blog",
      },
      {
        label: "All",
        href: "/blog",
        disabled: true,
      },
    ];

    expect(breadcrumbs).toEqual(expectedCrumbs);
  });
});
