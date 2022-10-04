import renderWithTheme from "../../../__tests__/__helpers__/renderWithTheme";
import { mockImageAsset } from "../../../__tests__/__helpers__/cms";

import BlogListItem, { BlogListItemProps } from ".";

const testProps: BlogListItemProps = {
  title: "Item title",
  titleTag: "h3",
  snippet: "Item snippet",
  href: "https://www.test.com/",
  contentType: "blog-post",
  category: { title: "Curriculum Planning", slug: "curriculum-planning" },
  mainImage: mockImageAsset(),
  date: new Date(2022, 7, 22).toISOString(),
};

describe("components/BlogListItem", () => {
  test("renders the correct heading tag", () => {
    const { getByRole } = renderWithTheme(
      <BlogListItem {...testProps} titleTag="h6" />
    );
    const listHeading = getByRole("heading", { level: 6 });

    expect(listHeading).toHaveTextContent("Item title");
  });

  test("button should have the correct href", async () => {
    const { getByRole } = renderWithTheme(
      <BlogListItem {...testProps} contentType="webinar" />
    );
    const button = getByRole("link", { name: testProps.title });
    expect(button).toHaveAttribute("href", "https://www.test.com/");
  });

  test("should contain link to category", async () => {
    const { getByRole } = renderWithTheme(
      <BlogListItem {...testProps} contentType="webinar" />
    );
    const button = getByRole("link", { name: testProps.category.title });
    expect(button).toHaveAttribute(
      "href",
      `/blog/categories/${testProps.category.slug}`
    );
  });

  test("renders the provided image", () => {
    const { getByRole } = renderWithTheme(
      <BlogListItem {...testProps} withImage />
    );

    const image = getByRole("img");
    /**
     * We can't really assert on the srcset, but the withImage=false test
     * should catch any false positives if another unrealted role=img was
     * introduced to the component
     */
    expect(image).toBeInTheDocument();
  });

  test("doesn't render an image without withImage=true", () => {
    const { queryByRole } = renderWithTheme(
      <BlogListItem {...testProps} withImage={false} />
    );

    const image = queryByRole("img");
    expect(image).not.toBeInTheDocument();
  });

  test("sets the image alt text to be empty when not provided", () => {
    const { getByRole } = renderWithTheme(
      <BlogListItem {...testProps} withImage />
    );

    const image = getByRole("img");
    // note: `toHaveAttribute("alt", "")` returns false positives, explicitly check
    expect(image?.getAttribute("alt")).toBe("");
  });
});
