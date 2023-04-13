import { mockVideoAsset } from "../../__tests__/__helpers__/cms";
import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";
import CMSVideo from "../CMSVideo";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockPlayer = jest.fn((_props: never) => <div />);

jest.mock("../VideoPlayer", () => ({
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
      })
    );
  });
});
