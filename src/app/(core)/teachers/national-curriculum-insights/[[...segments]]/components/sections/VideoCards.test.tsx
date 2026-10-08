import { screen } from "@testing-library/react";
import "jest-styled-components";

import { NationalCurriculumInsightsVideoCards } from "./VideoCards";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import type { NationalCurriculumInsightsModule } from "@/common-lib/cms-types/nationalCurriculumInsights";
import VideoPlayer from "@/components/SharedComponents/VideoPlayer";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";

jest.mock("@/components/SharedComponents/VideoPlayer", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="video-player" />),
}));

const section: Extract<
  NationalCurriculumInsightsModule,
  { __typename: "NationalCurriculumInsightsVideoCardsSection" }
> = {
  __typename: "NationalCurriculumInsightsVideoCardsSection",
  heading: "Curriculum conversations",
};

const post = {
  id: "episode-3",
  title: "Inclusive curriculum leadership",
  summary: "Planning an inclusive curriculum.",
  slug: "curriculum-conversations-episode-3",
  image: {
    asset: {
      _id: "image-example",
      url: "https://cdn.sanity.io/images/cuvjke51/production/thumbnail-960x540.jpg",
    },
    altText: "The curriculum conversation guests",
    hotspot: null,
    isPresentational: false,
  },
  video: {
    title: "Inclusive curriculum leadership",
    transcript: null,
    video: {
      asset: {
        assetId: "mux-asset",
        playbackId: "mux-playback",
        thumbTime: 12,
      },
    },
  },
};

beforeEach(() => {
  jest.clearAllMocks();
});

it("uses the selected blog image as the inline video poster", () => {
  renderWithTheme(
    <NationalCurriculumInsightsVideoCards
      section={{ ...section, posts: [post] }}
    />,
  );

  expect(VideoPlayer).toHaveBeenCalledWith(
    expect.objectContaining({
      poster: getProxiedSanityAssetUrl(post.image.asset.url),
      playbackId: "mux-playback",
      thumbnailTime: 12,
      location: "blog",
    }),
    expect.anything(),
  );
  const link = screen.getByRole("link", {
    name: /Inclusive curriculum leadership/,
  });
  expect(link).toHaveAttribute("href", `/blog/${post.slug}`);
  expect(link).not.toContainElement(screen.getByTestId("video-player"));

  const videoFrame = screen.getByTestId(
    "guidance-inline-video",
  ).firstElementChild;
  expect(videoFrame).toHaveStyleRule("border-radius", "0.5rem");
  expect(videoFrame).toHaveStyleRule("overflow", "hidden");
});

it("keeps the video frame fallback when the blog image has no asset", () => {
  renderWithTheme(
    <NationalCurriculumInsightsVideoCards
      section={{
        ...section,
        posts: [{ ...post, image: { ...post.image, asset: null } }],
      }}
    />,
  );

  expect(VideoPlayer).toHaveBeenCalledWith(
    expect.objectContaining({ poster: undefined, thumbnailTime: 12 }),
    expect.anything(),
  );
});

it("uses the blog image on the card when there is no inline video", () => {
  renderWithTheme(
    <NationalCurriculumInsightsVideoCards
      section={{ ...section, posts: [{ ...post, video: null }] }}
    />,
  );

  expect(VideoPlayer).not.toHaveBeenCalled();
  expect(screen.getByRole("img", { name: post.image.altText })).toHaveAttribute(
    "src",
    expect.stringContaining(
      encodeURIComponent(getProxiedSanityAssetUrl(post.image.asset.url)),
    ),
  );
  expect(
    screen.getByRole("link", { name: /Inclusive curriculum leadership/ }),
  ).toHaveAttribute("href", `/blog/${post.slug}`);
});

it("does not restore legacy videos when the selected blog posts are unpublished", () => {
  renderWithTheme(
    <NationalCurriculumInsightsVideoCards
      section={{
        __typename: "NationalCurriculumInsightsVideoCardsSection",
        heading: "Curriculum conversations",
        posts: [],
        cards: [
          {
            heading: "Retired video",
            description: "Previous preview",
            videoUrl: "https://example.com/video",
            image: {
              asset: null,
              altText: null,
              isPresentational: true,
              hotspot: null,
            },
          },
        ],
      }}
    />,
  );
  expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  expect(screen.queryByText("Retired video")).not.toBeInTheDocument();
});
