import renderWithProviders from "../../../__tests__/__helpers__/renderWithProviders";

import BlogListItem, { BlogListItemProps } from ".";

const testProps: BlogListItemProps = {
  title: "Item title",
  titleTag: "h3",
  snippet: "Item snippet",
  href: "https://www.test.com/",
  contentType: "blog-post",
};

describe("components/BlogListItem", () => {
  test("renders the correct heading tag", () => {
    const { getByRole } = renderWithProviders(
      <BlogListItem {...testProps} titleTag="h6" />
    );
    const listHeading = getByRole("heading", { level: 6 });

    expect(listHeading).toHaveTextContent("Item title");
  });

  test("button should have the correct href", async () => {
    const { getByRole } = renderWithProviders(
      <BlogListItem {...testProps} contentType="webinar" />
    );
    const button = getByRole("link");
    expect(button).toHaveAttribute("href", "https://www.test.com/");
  });
});
