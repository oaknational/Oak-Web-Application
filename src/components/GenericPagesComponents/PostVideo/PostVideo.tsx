import { PortableTextComponentProps } from "@portabletext/react";
import { OakBox, OakVideo } from "@oaknational/oak-components";

import { VideoLocationValueType } from "@/browser-lib/avo/Avo";
import { Video } from "@/common-lib/cms-types";
import VideoPlayer from "@/components/SharedComponents/VideoPlayer";

export type PostVideoProps = PortableTextComponentProps<Video> & {
  location?: VideoLocationValueType;
};

const PostVideo = (props: PostVideoProps) => {
  if (!props.value) {
    return null;
  }

  return (
    <OakBox $mt={"spacing-56"} $width="100%">
      <OakVideo
        videoSlot={
          <VideoPlayer
            playbackPolicy="public"
            playbackId={props.value.video.asset.playbackId}
            thumbnailTime={props.value.video.asset.thumbTime}
            title={props.value.title}
            location={props.location ?? "blog"}
            omitBorder={true}
          />
        }
        showTranscript={true}
        transcript={props.value.transcript}
      />
    </OakBox>
  );
};

export default PostVideo;
