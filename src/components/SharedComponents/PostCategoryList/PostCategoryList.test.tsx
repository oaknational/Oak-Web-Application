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
  it("should render links to lessons", () => {
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
  it("should work with webinars", () => {
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
  it("current link should be signposted with aria-current='page'", () => {
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
    const currentLink = getByRole("link", { current: "page" });
    expect(currentLink).toHaveAccessibleName("Lesson Planning");
  });
  it("selectedCategorySlug null should mean All is current", () => {
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
    const currentLink = getByRole("link", { current: "page" });
    expect(currentLink).toHaveAccessibleName("All");
  });
  it("non current links should not be signposted with aria-current", () => {
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
  it("nav element should have the correct accessible name", () => {
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
