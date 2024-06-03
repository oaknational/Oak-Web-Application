import { render } from "@testing-library/react";

import VideoPage from "@/pages/videos/player/[videoId]";

jest.mock("next/router", () => ({
  __esModule: true,
  ...jest.requireActual("next/router"),
  useRouter: () => ({
    ...jest.requireActual("next/router").useRouter,
    asPath: "asPath test value",
    query: { videoId: "videoId" },
    pathname: "/video/player/[videoId]",
  }),
}));
jest.mock("@/components/SharedComponents/VideoPlayer/VideoPlayer", () => ({
  __esModule: true,
  default: () => <video data-testid="video-element" />,
}));

it("Renders the video player", () => {
  const { getByTestId } = render(<VideoPage />);
  expect(getByTestId("video-element")).toBeInTheDocument();
});
