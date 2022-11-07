import renderWithProviders from "../../../__tests__/__helpers__/renderWithProviders";

import BlogList from ".";

describe("components/BlogList", () => {
  test("renders the list items", () => {
    const { getByRole } = renderWithProviders(
      <BlogList
        items={[
          {
            title: "Item title",
            titleTag: "h3",
            summary: "Item summary",
            slug: "item-slug",
            contentType: "blog-post",
            category: {
              title: "Curriculum Planning",
              slug: "curriculum-planning",
            },
            date: new Date(2022, 8, 22).toISOString(),
          },
        ]}
      />
    );

    const listHeading = getByRole("heading", { level: 3 });

    expect(listHeading).toBeInTheDocument();
  });

  test("formats the date correctly", () => {
    const { getByText } = renderWithProviders(
      <BlogList
        items={[
          {
            title: "Item title",
            titleTag: "h3",
            summary: "Item summary",
            slug: "item-slug",
            contentType: "blog-post",
            category: {
              title: "Curriculum Planning",
              slug: "curriculum-planning",
            },
            date: new Date(2022, 7, 22).toISOString(),
          },
        ]}
      />
    );

    const formattedDate = getByText("22 August 2022");

    expect(formattedDate).toBeInTheDocument();
  });
});
