import { useRouter } from "next/router";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import VideoPlayer from "@/components/SharedComponents/VideoPlayer";

const VideoPage = () => {
  const router = useRouter();
  const { videoId } = router.query;

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <VideoPlayer
        playbackId={videoId as string}
        playbackPolicy={"signed"}
        title={"title"}
        location={"lesson"}
        isLegacy={true}
      />
    </OakThemeProvider>
  );
};

export default VideoPage;
