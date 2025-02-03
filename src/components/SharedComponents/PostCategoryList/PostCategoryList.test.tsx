import PostCategoryList from "./PostCategoryList";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const labelId = "test-label-id";

vi.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: vi.fn(),
  }),
}));

describe("PostCategoryList", () => {
  test("should render links to lessons", () => {
    const { getByRole } = renderWithTheme(
      <PostCategoryList
        labelledBy={labelId}
        page={"blog-index"}
        categories={[
          { title: "Oak Updates", slug: "oak-updates" },
          { title: "Lesson Planning", slug: "lesson-planning" },
        ]}
      />,
    );
    expect(getByRole("link", { name: "Oak Updates" })).toHaveAttribute(
      "href",
      "/blog/categories/oak-updates",
    );
    expect(getByRole("link", { name: "Lesson Planning" })).toHaveAttribute(
      "href",
      "/blog/categories/lesson-planning",
    );
  });
  test("should work with webinars", () => {
    const { getByRole } = renderWithTheme(
      <PostCategoryList
        labelledBy={labelId}
        page={"webinar-index"}
        categories={[
          { title: "Oak Updates", slug: "oak-updates" },
          { title: "Lesson Planning", slug: "lesson-planning" },
        ]}
      />,
    );
    expect(getByRole("link", { name: "Oak Updates" })).toHaveAttribute(
      "href",
      "/webinars/categories/oak-updates",
    );
    expect(getByRole("link", { name: "Lesson Planning" })).toHaveAttribute(
      "href",
      "/webinars/categories/lesson-planning",
    );
  });
  test("current link should be signposted with aria-current=true", () => {
    const { getByRole } = renderWithTheme(
      <PostCategoryList
        page={"blog-index"}
        labelledBy={labelId}
        categories={[
          { title: "Oak Updates", slug: "oak-updates" },
          { title: "Lesson Planning", slug: "lesson-planning" },
        ]}
        selectedCategorySlug="lesson-planning"
      />,
    );
    const currentLink = getByRole("link", { current: true });
    expect(currentLink).toHaveAccessibleName("Lesson Planning");
  });
  test("selectedCategorySlug null should mean All is current", () => {
    const { getByRole } = renderWithTheme(
      <PostCategoryList
        page={"blog-index"}
        labelledBy={labelId}
        categories={[
          { title: "Oak Updates", slug: "oak-updates" },
          { title: "Lesson Planning", slug: "lesson-planning" },
        ]}
        selectedCategorySlug={null}
      />,
    );
    const currentLink = getByRole("link", { current: true });
    expect(currentLink).toHaveAccessibleName("All");
  });
  test("non current links should not be signposted with aria-current", () => {
    const { getByRole } = renderWithTheme(
      <PostCategoryList
        page={"blog-index"}
        labelledBy={labelId}
        categories={[
          { title: "Oak Updates", slug: "oak-updates" },
          { title: "Lesson Planning", slug: "lesson-planning" },
        ]}
        selectedCategorySlug="lesson-planning"
      />,
    );
    const nonCurrentLink = getByRole("link", { name: "Oak Updates" });
    expect(nonCurrentLink).not.toHaveAttribute("aria-current");
  });
  test("nav element should have the correct accessible name", () => {
    const { getByRole } = renderWithTheme(
      <>
        <span id={labelId}>Test Categories</span>
        <PostCategoryList
          page={"blog-index"}
          labelledBy={labelId}
          categories={[
            { title: "Oak Updates", slug: "oak-updates" },
            { title: "Lesson Planning", slug: "lesson-planning" },
          ]}
          selectedCategorySlug="lesson-planning"
        />
      </>,
    );
    const nav = getByRole("navigation");
    expect(nav).toHaveAccessibleName("Test Categories");
  });
});
