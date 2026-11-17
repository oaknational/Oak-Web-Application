import { screen } from "@testing-library/react";
import "jest-styled-components";
import userEvent from "@testing-library/user-event";

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
  posts: [],
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

it("uses compact type and independent playback", async () => {
  const user = userEvent.setup();
  renderWithTheme(
    <NationalCurriculumInsightsVideoCards
      section={{ ...section, posts: [post] }}
    />,
  );

  expect(screen.getByRole("heading", { name: post.title })).toHaveStyleRule(
    "font-size",
    "1rem",
  );
  expect(screen.getByText(post.summary)).toHaveStyleRule(
    "font-size",
    "0.875rem",
  );
  expect(VideoPlayer).not.toHaveBeenCalled();
  await user.click(screen.getByRole("button", { name: `Play ${post.title}` }));
  expect(VideoPlayer).toHaveBeenCalledWith(
    expect.objectContaining({
      autoPlay: true,
      autoFocusPlayButton: true,
      poster: getProxiedSanityAssetUrl(post.image.asset.url),
    }),
    expect.anything(),
  );
  expect(
    screen.getByRole("link", { name: /Inclusive curriculum leadership/ }),
  ).not.toContainElement(screen.getByTestId("video-player"));
});

it("keeps a poster and blog link when a post has no inline video", () => {
  renderWithTheme(
    <NationalCurriculumInsightsVideoCards
      section={{ ...section, posts: [{ ...post, video: null }] }}
    />,
  );

  expect(VideoPlayer).not.toHaveBeenCalled();
  expect(
    screen.getByRole("img", { name: post.image.altText }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /Inclusive curriculum leadership/ }),
  ).toHaveAttribute("href", `/blog/${post.slug}`);
});

it("starts only the selected video", async () => {
  const user = userEvent.setup();
  const secondPost = {
    ...post,
    id: "episode-4",
    title: "Preparing for curriculum change",
    slug: "curriculum-conversations-episode-4",
  };
  renderWithTheme(
    <NationalCurriculumInsightsVideoCards
      section={{ ...section, posts: [post, secondPost] }}
    />,
  );

  await user.click(screen.getByRole("button", { name: `Play ${post.title}` }));

  expect(screen.getAllByTestId("video-player")).toHaveLength(1);
  expect(
    screen.queryByRole("button", { name: `Play ${post.title}` }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: `Play ${secondPost.title}` }),
  ).toBeInTheDocument();
  expect(VideoPlayer).toHaveBeenLastCalledWith(
    expect.objectContaining({ title: post.title, autoPlay: true }),
    expect.anything(),
  );
});

it("uses the selected blog image as the inline video poster", async () => {
  const user = userEvent.setup();
  renderWithTheme(
    <NationalCurriculumInsightsVideoCards
      section={{ ...section, posts: [post] }}
    />,
  );

  expect(
    screen
      .getByRole("button", { name: `Play ${post.title}` })
      .querySelector("img"),
  ).toHaveAttribute(
    "src",
    expect.stringContaining(
      encodeURIComponent(getProxiedSanityAssetUrl(post.image.asset.url)),
    ),
  );
  expect(VideoPlayer).not.toHaveBeenCalled();
  await user.click(screen.getByRole("button", { name: `Play ${post.title}` }));
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

it("omits the section when no published blog posts resolve", () => {
  renderWithTheme(
    <NationalCurriculumInsightsVideoCards
      section={{ ...section, posts: [] }}
    />,
  );
  expect(screen.queryByRole("heading")).not.toBeInTheDocument();
});
