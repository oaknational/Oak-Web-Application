import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import NewContentBanner, { StyledVideoFlex } from "./NewContentBanner";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { VideoPlayerProps } from "@/components/SharedComponents/VideoPlayer";
import { resolveOakHref } from "@/common-lib/urls";

const render = renderWithProviders();

const VideoPlayerMock = ({ userEventCallback }: Partial<VideoPlayerProps>) => {
  if (userEventCallback) {
    userEventCallback({
      event: "play",
      timeElapsed: 20,
      duration: 40,
      muted: false,
    });
  }
  return <video data-testid="video-player" />;
};

jest.mock("@/components/SharedComponents/VideoPlayer/VideoPlayer", () => {
  return ({ userEventCallback }: Partial<VideoPlayerProps>) => (
    <VideoPlayerMock userEventCallback={userEventCallback} />
  );
});

jest.mock("@/common-lib/urls"); // Mock the resolveOakHref function

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
    render(
      <NewContentBanner
        subjectSlug="english-reading-for-pleasure"
        subjectTitle="English"
        programmeSlug="english-primary-ks2"
        keyStageSlug="ks2"
        isUnitListing={true}
        isLegacy={true}
      />,
    );

    expect(resolveOakHref).toHaveBeenCalled();
  });

  it("resolves href for programme-index page", () => {
    render(
      <NewContentBanner
        subjectSlug="biology"
        subjectTitle="Biology"
        programmeSlug="biology-secondary-ks4"
        keyStageSlug="ks4"
        isUnitListing={false}
        isLegacy={true}
      />,
    );

    expect(resolveOakHref).toHaveBeenCalledWith({
      page: "programme-index",
      keyStageSlug: "ks4",
      subjectSlug: "biology",
    });
  });

  it("renders video player and text text when video is playing", () => {
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
    expect(getByTestId("video-player")).toBeInTheDocument();
  });

  describe("StyledVideoFlex", () => {
    test("renders with correct styles when expand is true", () => {
      const { container } = render(
        <StyledVideoFlex>
          <p>Test</p>
        </StyledVideoFlex>,
      );

      const paragraph = container.querySelector("p");

      expect(paragraph).toHaveStyle("display: block");
    });
  });
});
