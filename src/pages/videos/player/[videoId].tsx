import { useRouter } from "next/router";

import VideoPlayer from "@/components/SharedComponents/VideoPlayer";

const VideoPage = () => {
  const router = useRouter();
  const { videoId } = router.query;

  return (
    <VideoPlayer
      playbackId={videoId as string}
      playbackPolicy={"signed"}
      title={"title"}
      location={"lesson"}
      isLegacy={true}
    />
  );
};

export default VideoPage;
