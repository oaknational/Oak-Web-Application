import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import NewContentBanner from "./NewContentBanner";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { VideoPlayerProps } from "@/components/SharedComponents/VideoPlayer";

const render = renderWithProviders();

const VideoPlayerMock = ({ userEventCallback }: Partial<VideoPlayerProps>) => {
  if (userEventCallback) {
    userEventCallback({ event: "play", timeElapsed: 20, duration: 40 });
  }
  return <video data-testid="video-player" />;
};

jest.mock("@/components/SharedComponents/VideoPlayer/VideoPlayer", () => {
  return ({ userEventCallback }: Partial<VideoPlayerProps>) => (
    <VideoPlayerMock userEventCallback={userEventCallback} />
  );
});

describe("NewContentBanner component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders NewContentBanner component", () => {
    const { getByText } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <NewContentBanner
          subjectSlug="english-reading-for-pleasure"
          subjectTitle="English"
          programmeSlug=""
          keyStageSlug="ks2"
          isUnitListing={true}
          isLegacy={true}
        />
      </OakThemeProvider>,
    );
    const title = getByText("Switch to our new English teaching resources");

    expect(title).toBeInTheDocument();
  });

  it("sets the correct href attribute for the link", () => {
    const { getByText } = render(
      <NewContentBanner
        subjectSlug="english-reading-for-pleasure"
        subjectTitle="English"
        programmeSlug="english-primary-ks2"
        keyStageSlug="ks2"
        isUnitListing={true}
        isLegacy={true}
      />,
    );

    const linkElement = getByText("Go to English resources").closest("a");

    expect(linkElement).toHaveAttribute(
      "href",
      "/teachers/programmes/english-primary-ks2/units",
    );
  });

  it("resolves href for programme-index page", () => {
    const { getByRole } = render(
      <NewContentBanner
        subjectSlug="biology"
        subjectTitle="Biology"
        programmeSlug="biology-secondary-ks4"
        keyStageSlug="ks4"
        isUnitListing={false}
        isLegacy={true}
      />,
    );

    const linkElement = getByRole("link");

    expect(linkElement).toHaveAttribute(
      "href",
      "/teachers/key-stages/ks4/subjects/biology/programmes",
    );
  });

  it("renders video player and text text when video is playing", () => {
    const { getByTestId, getByText } = render(
      <NewContentBanner
        subjectSlug="english-reading-for-pleasure"
        subjectTitle="English"
        programmeSlug="english-primary-ks2"
        keyStageSlug="ks2"
        isUnitListing={true}
        isLegacy={true}
      />,
    );

    expect(getByText("Play new resources video")).toBeInTheDocument();
    expect(getByTestId("video-player")).toBeInTheDocument();
  });

  it("displays the paragraph correctly based on the expand prop and screen width", () => {
    const { getByText } = render(
      <NewContentBanner
        subjectSlug="english-reading-for-pleasure"
        subjectTitle="English"
        programmeSlug="english-primary-ks2"
        keyStageSlug="ks2"
        isUnitListing={true}
        isLegacy={true}
      />,
    );

    window.innerWidth = 1200;
    window.dispatchEvent(new Event("resize"));

    const paragraph = getByText(/Play new resources video/i);
    expect(paragraph).toHaveStyle("display: block");
  });

  it.only("video container", () => {
    const { getByTestId } = render(
      <NewContentBanner
        subjectSlug="english-reading-for-pleasure"
        subjectTitle="English"
        programmeSlug="english-primary-ks2"
        keyStageSlug="ks2"
        isUnitListing={true}
        isLegacy={true}
      />,
    );

    const videoSection = getByTestId("video-player-container");
    expect(videoSection).toHaveStyle("width: 15rem");
  });
});
