import { getByRole, screen, waitFor, within } from "@testing-library/react";

import Home, { SerializedPost } from "../../pages";
import renderWithProviders from "../__helpers__/renderWithProviders";

describe("pages/index.tsx", () => {
  it("Renders correct title ", async () => {
    renderWithProviders(<Home posts={[]} isPreviewMode={false} />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Oak"
      );
    });
  });

  it("Renders a link to the blog list", async () => {
    renderWithProviders(<Home posts={[]} isPreviewMode={false} />);

    await waitFor(() => {
      const blogLink = screen.getByText("All blogs");
      expect(blogLink).toBeInTheDocument();
      expect(blogLink).toHaveAttribute("href", "/blog");
    });
  });

  it("Renders the provided blog posts", async () => {
    const mockPosts = [
      {
        id: "1",
        type: "blog-post",
        title: "Some blog post",
        slug: "some-blog-post",
        date: new Date("2022-12-01").toISOString(),
        category: { title: "Some category", slug: "some-category" },
      },
      {
        id: "2",
        type: "blog-post",
        title: "Some other post",
        slug: "some-other-post",
        date: new Date("2022-12-01").toISOString(),
        category: { title: "Some category", slug: "some-category" },
      },
    ] as SerializedPost[];

    renderWithProviders(<Home posts={mockPosts} isPreviewMode={false} />);

    await waitFor(() => {
      const list = screen
        .getAllByRole("list")
        .find((list) => list.textContent?.includes("Some blog post"));

      expect(list).toBeInTheDocument();

      const { getAllByRole } = within(list as HTMLElement);
      const items = getAllByRole("listitem");

      expect(items).toHaveLength(2);

      expect(getByRole(items[0] as HTMLElement, "link")).toHaveAttribute(
        "href",
        "/blog/some-blog-post"
      );
    });
  });
});
