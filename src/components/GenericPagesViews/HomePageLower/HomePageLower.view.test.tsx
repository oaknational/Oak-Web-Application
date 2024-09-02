import { screen, within, getByRole } from "@testing-library/react";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { HomePageLowerView } from "@/components/GenericPagesViews/HomePageLower/HomePageLower.view";
import { SerializedPost } from "@/pages-helpers/homesite/getBlogPosts";

jest.mock("src/node-lib/cms");

const mockPosts = [
  {
    id: "1",
    type: "blog-post",
    title: "Some blog post",
    slug: "some-blog-post",
    date: new Date("2021-12-01").toISOString(),
    category: { title: "Some category", slug: "some-category" },
  },
  {
    id: "2",
    type: "blog-post",
    title: "Some other post",
    slug: "some-other-post",
    date: new Date("2021-12-01").toISOString(),
    category: { title: "Some category", slug: "some-category" },
  },
] as SerializedPost[];

const render = renderWithProviders();

describe("HomePageLowerView", () => {
  it("Renders the provided blog posts", async () => {
    render(<HomePageLowerView posts={mockPosts} />);

    const list = screen
      .getAllByRole("list")
      .find((list) => list.textContent?.includes("Some blog post"));

    expect(list).toBeInTheDocument();

    const { getAllByRole } = within(list as HTMLElement);
    const items = getAllByRole("listitem");

    expect(items).toHaveLength(2);

    expect(
      getByRole(items[0] as HTMLElement, "link", {
        name: "Some blog post",
      }),
    ).toHaveAttribute("href", "/blog/some-blog-post");
  });

  it("Renders a link to the blog list", () => {
    render(<HomePageLowerView posts={mockPosts} />);

    const blogLink = screen.getByText("All blogs");
    expect(blogLink).toBeInTheDocument();
    expect(blogLink).toHaveAttribute("href", "/blog");
  });
});
