import { PortableTextComponentProps } from "@portabletext/react";
import { OakBox, OakVideo } from "@oaknational/oak-components";

import { Video } from "@/common-lib/cms-types";
import VideoPlayer from "@/components/SharedComponents/VideoPlayer";

const PostVideo = (props: PortableTextComponentProps<Video>) => {
  if (!props.value) {
    return null;
  }

  return (
    <OakBox $mt={"spacing-56"}>
      <OakVideo
        videoSlot={
          <VideoPlayer
            playbackPolicy="public"
            playbackId={props.value.video.asset.playbackId}
            title={props.value.title}
            location="blog"
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
