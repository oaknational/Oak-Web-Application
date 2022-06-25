import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import BlogList from ".";

describe("components/BlogList", () => {
  test("renders the correct heading tag", () => {
    const { getByRole } = renderWithProviders(
      <BlogList
        title="Blog List Title"
        titleTag="h2"
        items={[
          {
            title: "Item title",
            titleTag: "h3",
            snippet: "Item snippet",
            href: "/",
            contentType: "blog-post",
          },
        ]}
      />
    );
    const listHeading = getByRole("heading", { level: 2 });

    expect(listHeading).toHaveTextContent("Blog List Title");
  });
  test("renders the list items", () => {
    const { getByRole } = renderWithProviders(
      <BlogList
        title="Blog List Title"
        titleTag="h2"
        items={[
          {
            title: "Item title",
            titleTag: "h3",
            snippet: "Item snippet",
            href: "/",
            contentType: "blog-post",
          },
        ]}
      />
    );
    const listHeading = getByRole("heading", { level: 3 });

    expect(listHeading).toBeInTheDocument();
  });
});
