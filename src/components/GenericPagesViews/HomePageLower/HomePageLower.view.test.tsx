import { screen, within, getByRole } from "@testing-library/react";
import { useFeatureFlagEnabled } from "posthog-js/react";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { HomePageLowerView } from "@/components/GenericPagesViews/HomePageLower/HomePageLower.view";
import { SerializedPost } from "@/pages-helpers/home/getBlogPosts";
import { HomePage } from "@/common-lib/cms-types";

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

// mock the testimonials component
jest.mock("@/components/GenericPagesComponents/Testimonials", () => ({
  Testimonials: () => <div data-testid="testimonials">Testimonials</div>,
}));

// mock the useFeatureFlagEnabled hook
jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: jest.fn(() => false),
}));

const imageFixture = {
  asset: {
    _id: "test",
    url: "https://some-image-url.com",
  },
  altText: "Some alt text",
};

const introVideoFixture: HomePage["intro"] = {
  mediaType: "video",
  title: "test",
  alignMedia: "left",
  bodyPortableText: [
    {
      children: [
        {
          text: "test",
        },
      ],
    },
  ],
  video: {
    title: "test",
    captions: null,
    video: {
      asset: {
        assetId: "test",
        playbackId: "test",
        thumbTime: null,
      },
    },
  },
};

const testimonialFixture: HomePage["testimonials"] = [
  {
    quote: {
      text: "Some testimonial",
      role: "Some role",
      attribution: "Some name",
      organisation: "Some organisation",
    },
    image: imageFixture,
  },
];

describe("HomePageLowerView", () => {
  it("Renders the provided blog posts", async () => {
    render(
      <HomePageLowerView
        posts={mockPosts}
        testimonials={null}
        introVideo={null}
      />,
    );

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
    render(
      <HomePageLowerView
        posts={mockPosts}
        testimonials={null}
        introVideo={null}
      />,
    );

    const blogLink = screen.getByText("All blogs");
    expect(blogLink).toBeInTheDocument();
    expect(blogLink).toHaveAttribute("href", "/blog");
  });

  it("Does not render testimonials if the feature flag is disabled", () => {
    render(
      <HomePageLowerView
        posts={mockPosts}
        testimonials={null}
        introVideo={null}
      />,
    );

    const testimonials = screen.queryByTestId("testimonials");
    expect(testimonials).not.toBeInTheDocument();
  });

  it("Renders testimonials if the feature flag is enabled", () => {
    (useFeatureFlagEnabled as jest.Mock).mockReturnValue(true);

    render(
      <HomePageLowerView
        posts={mockPosts}
        testimonials={testimonialFixture}
        introVideo={introVideoFixture}
      />,
    );

    const testimonials = screen.getByTestId("testimonials");
    expect(testimonials).toBeInTheDocument();
  });
});
