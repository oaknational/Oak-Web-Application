import { FC } from "react";
import { OakFlex } from "@oaknational/oak-components";

import { VideoLocationValueType } from "@/browser-lib/avo/Avo";
import { Video } from "@/common-lib/cms-types";
import VideoPlayer, {
  VideoPlayerProps,
} from "@/components/SharedComponents/VideoPlayer";
import TranscriptToggle from "@/components/TeacherComponents/TranscriptViewer/TranscriptToggle";

type OtherVideoPlayerProps = Partial<
  Omit<VideoPlayerProps, "thumbnailTime" | "playbackId">
>;
type CMSVideoProps = OtherVideoPlayerProps & {
  video: Video;
  location: VideoLocationValueType;
  hideCaptions?: boolean;
};

const CMSVideo: FC<CMSVideoProps> = ({ video, hideCaptions, ...rest }) => {
  const videoCaptions =
    video.captions && !hideCaptions && video.captions.length > 0
      ? video.captions
      : null;

  return (
    <>
      <OakFlex
        $position={"relative"}
        $flexDirection={"column"}
        $gap={["spacing-24"]}
        $width={"100%"}
      >
        <VideoPlayer
          playbackPolicy="public"
          thumbnailTime={video.video.asset.thumbTime}
          playbackId={video.video.asset.playbackId}
          title={video.title}
          isLegacy={true}
          {...rest}
        />
        {videoCaptions && (
          <TranscriptToggle transcriptSentences={videoCaptions} />
        )}
      </OakFlex>
    </>
  );
};

export default CMSVideo;
