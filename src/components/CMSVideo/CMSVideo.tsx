import { FC } from "react";

import { VideoLocationValueType } from "../../browser-lib/avo/Avo";
import { Video } from "../../common-lib/cms-types";
import VideoPlayer from "../VideoPlayer";
import { VideoPlayerProps } from "../VideoPlayer/VideoPlayer";

type OtherVideoPlayerProps = Partial<
  Omit<VideoPlayerProps, "thumbnailTime" | "playbackId">
>;
type CMSVideoProps = OtherVideoPlayerProps & {
  video: Video;
  location: VideoLocationValueType;
};

const CMSVideo: FC<CMSVideoProps> = ({ video, ...rest }) => {
  return (
    <VideoPlayer
      playbackPolicy="public"
      thumbnailTime={video.video.asset.thumbTime}
      playbackId={video.video.asset.playbackId}
      title={video.title}
      isLegacy={true}
      {...rest}
    />
  );
};

export default CMSVideo;
