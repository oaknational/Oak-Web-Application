import { screen, within, getByRole, fireEvent } from "@testing-library/react";

import { aboutUsAccessed } from "@/browser-lib/avo/Avo";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { HomePageLowerView } from "@/components/GenericPagesViews/HomePageLower/HomePageLower.view";
import { SerializedPost } from "@/pages-helpers/home/getBlogPosts";
import {
  bodyPortableTextWithStyling,
  headingPortableText,
  subheadingPortableText,
} from "@/fixtures/campaign/portableText";
import { mockImageAsset } from "@/__tests__/__helpers__/cms";

jest.mock("src/node-lib/cms");
jest.mock("@/browser-lib/avo/Avo", () => ({
  ...jest.requireActual("@/browser-lib/avo/Avo"),
  aboutUsAccessed: jest.fn(),
}));

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

const mockCampaignPromoBanner = {
  headingPortableTextWithPromo: headingPortableText("test-heading-text"),
  subheadingPortableTextWithPromo: subheadingPortableText(),
  bodyPortableTextWithPromo: bodyPortableTextWithStyling(),
  buttonCta: "Learn More",
  media: [mockImageAsset()],
};

const mockTestimonials = [
  {
    quote: {
      text: "This is a testimonial quote.",
      attribution: "John Doe",
      role: "Teacher",
      organisation: null,
    },
  },
];

const mockIntroVideo = {
  mediaType: "video" as const,
  title: "We're here to support great teaching",
  video: {
    title: "Mock Video Title",
    video: {
      asset: {
        assetId: "mockAssetId",
        playbackId: "mockPlaybackId",
        thumbTime: null,
      },
    },
  },
  bodyPortableText: [],
  alignMedia: "left" as const,
};

const render = renderWithProviders();

// mock the testimonials component
jest.mock("@/components/GenericPagesComponents/Testimonials", () => ({
  Testimonials: () => <div data-testid="testimonials">Testimonials</div>,
}));

// mock the useFeatureFlagEnabled hook
const mockFeatureFlagEnabled = jest.fn().mockReturnValue(false);
jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => mockFeatureFlagEnabled(),
}));

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

  it("Shows campaign banner when provided", () => {
    mockFeatureFlagEnabled.mockReturnValue(true);

    render(
      <HomePageLowerView
        campaignPromoBanner={mockCampaignPromoBanner}
        posts={mockPosts}
        testimonials={null}
        introVideo={null}
      />,
    );

    const campaignBanner = screen.getByText("test-heading-text");
    expect(campaignBanner).toBeInTheDocument();
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

  it("should call aboutUsAccessed with the correct analytics object when the About Oak button is clicked", () => {
    const { getByRole } = render(
      <HomePageLowerView
        posts={mockPosts}
        testimonials={mockTestimonials}
        introVideo={mockIntroVideo}
      />,
    );

    const aboutOakButtonLink = getByRole("link", { name: /about oak/i });
    fireEvent.click(aboutOakButtonLink);

    expect(aboutUsAccessed).toHaveBeenCalledWith(
      expect.objectContaining({
        componentType: "about_oak",
      }),
    );
  });
});
