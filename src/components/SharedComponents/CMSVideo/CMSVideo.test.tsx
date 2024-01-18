import CMSVideo from ".";

import { mockVideoAsset } from "@/__tests__/__helpers__/cms";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const mockPlayer = vi.fn(() => <div />);

vi.mock("@/components/SharedComponents/VideoPlayer", () => ({
  __esModule: true,
  default: (props: never) => mockPlayer(props),
}));

const render = renderWithProviders();

describe("CMSVideo", () => {
  it("passes video props to VideoPlayer", () => {
    const mockVideo = mockVideoAsset();
    render(<CMSVideo video={mockVideo} location="marketing" />);

    expect(mockPlayer).toHaveBeenCalledWith(
      expect.objectContaining({
        playbackId: mockVideo.video.asset.playbackId,
        thumbnailTime: mockVideo.video.asset.thumbTime,
        title: mockVideo.title,
      }),
    );
  });
});
