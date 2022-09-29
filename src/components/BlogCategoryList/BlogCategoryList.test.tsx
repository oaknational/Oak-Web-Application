import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import BlogCategoryList from "./BlogCategoryList";

describe("BlogCategoryList", () => {
  test("should render links to lessons", () => {
    const { getByRole } = renderWithTheme(
      <BlogCategoryList
        categories={[
          { title: "Oak Updates", slug: "oak-updates" },
          { title: "Lesson Planning", slug: "lesson-planning" },
        ]}
      />
    );
    expect(getByRole("link", { name: "Oak Updates" })).toHaveAttribute(
      "href",
      "/blog/categories/oak-updates"
    );
    expect(getByRole("link", { name: "Lesson Planning" })).toHaveAttribute(
      "href",
      "/blog/categories/lesson-planning"
    );
  });
  test("current link should be signposted with aria-current='page'", () => {
    const { getByRole } = renderWithTheme(
      <BlogCategoryList
        categories={[
          { title: "Oak Updates", slug: "oak-updates" },
          { title: "Lesson Planning", slug: "lesson-planning" },
        ]}
        selectedCategorySlug="lesson-planning"
      />
    );
    const currentLink = getByRole("link", { current: "page" });
    expect(currentLink).toHaveAccessibleName("Lesson Planning");
  });
  test("non current links should not be signposted with aria-current", () => {
    const { getByRole } = renderWithTheme(
      <BlogCategoryList
        categories={[
          { title: "Oak Updates", slug: "oak-updates" },
          { title: "Lesson Planning", slug: "lesson-planning" },
        ]}
        selectedCategorySlug="lesson-planning"
      />
    );
    const nonCurrentLink = getByRole("link", { name: "Oak Updates" });
    expect(nonCurrentLink).not.toHaveAttribute("aria-current");
  });
});
