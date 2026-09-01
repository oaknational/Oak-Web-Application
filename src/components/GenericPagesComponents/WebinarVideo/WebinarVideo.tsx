import { OakVideo } from "@oaknational/oak-components";

import UpcomingWebinarWall, {
  useUpcomingWebinarWall,
} from "../UpcomingWebinarWall";

import { SerializedWebinar } from "@/pages/webinars/[webinarSlug]";
import WebinarRegistration, {
  useWebinarRegistration,
} from "@/components/GenericPagesComponents/WebinarRegistration";
import isUpcomingWebinar from "@/utils/isUpcomingWebinar";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";
import AspectRatio from "@/components/SharedComponents/AspectRatio";
import VideoPlayer from "@/components/SharedComponents/VideoPlayer";

type WebinarVideoProps = {
  webinar: SerializedWebinar;
};
/**
 * ### For upcoming webinars:
 *
 * Displays the `UpcomingWebinarWall` component.
 *
 * ### For past webinars:
 *
 * Displays the `WebinarRegistration` form to the user if they've never submitted
 * it. Else it shows them the video, using `CMSVideo` component.
 *
 * ### Note
 *
 * There is a "pending" state for server rendering, which shows a 16:9 white
 * box with borders.
 *
 **/
const WebinarVideo = (props: WebinarVideoProps) => {
  const { webinar } = props;
  const { webinarLockState, webinarRegistrationProps } =
    useWebinarRegistration();

  const upcomingWebinarWallProps = useUpcomingWebinarWall(webinar);

  if (isUpcomingWebinar(webinar)) {
    return (
      <AspectRatio ratio="16:9">
        <UpcomingWebinarWall {...upcomingWebinarWallProps} />
        <BoxBorders />
      </AspectRatio>
    );
  }

  switch (webinarLockState) {
    case "pending":
      return (
        <>
          <AspectRatio ratio="16:9" />
          <BoxBorders />
        </>
      );
    case "unlocked":
      return (
        <OakVideo
          videoSlot={
            <VideoPlayer
              playbackPolicy="public"
              thumbnailTime={webinar.video.video.asset.thumbTime}
              playbackId={webinar.video.video.asset.playbackId}
              title={webinar.video.title}
              location="webinar"
              omitBorder={true}
            />
          }
          showTranscript={true}
          transcript={webinar.video.transcript ?? undefined}
        />
      );
    case "locked":
      return <WebinarRegistration {...webinarRegistrationProps} />;
  }
};

export default WebinarVideo;
