import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import BlogList from ".";

describe("components/BlogList", () => {
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
            mainImage: "",
            category: "Curriculum Planning",
            date: new Date(2022, 8, 22),
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
        title="Blog List Title"
        titleTag="h2"
        items={[
          {
            title: "Item title",
            titleTag: "h3",
            snippet: "Item snippet",
            href: "/",
            mainImage: "",
            contentType: "blog-post",
            category: "Curriculum Planning",
            date: new Date(2022, 7, 22),
          },
        ]}
      />
    );

    const formattedDate = getByText("22 August 2022");

    expect(formattedDate).toBeInTheDocument();
  });
});
