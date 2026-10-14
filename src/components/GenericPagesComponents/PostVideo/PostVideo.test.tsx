import PostVideo from "./PostVideo";
import type { PostVideoProps } from "./PostVideo";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import VideoPlayer from "@/components/SharedComponents/VideoPlayer";

jest.mock("@/components/SharedComponents/VideoPlayer/VideoPlayer", () =>
  jest.fn(() => <div>MOCK_VIDEO</div>),
);

const render = renderWithProviders();

describe("PostVideo", () => {
  const defaultProps: PostVideoProps = {
    index: 0,
    isInline: false,
    renderNode: () => null,
    value: {
      title: "Test Video",
      video: {
        asset: {
          assetId: "0",
          playbackId: "testPlaybackId",
          thumbTime: 0,
        },
      },
    },
  };

  it("should render correctly", () => {
    const { container } = render(<PostVideo {...defaultProps} />);
    expect(VideoPlayer).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Test Video",
        location: "blog",
      }),
      expect.anything(),
    );
    expect(container).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("allow override of location", () => {
    const { container } = render(
      <PostVideo {...defaultProps} location="marketing" />,
    );
    expect(VideoPlayer).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Test Video",
        location: "marketing",
      }),
      expect.anything(),
    );
    expect(container).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
