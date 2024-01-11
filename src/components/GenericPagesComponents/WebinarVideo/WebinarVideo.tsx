import UpcomingWebinarWall, {
  useUpcomingWebinarWall,
} from "../UpcomingWebinarWall";

import { SerializedWebinar } from "@/pages/webinars/[webinarSlug]";
import WebinarRegistration, {
  useWebinarRegistration,
} from "@/components/GenericPagesComponents/WebinarRegistration";
import isUpcomingWebinar from "@/utils/isUpcomingWebinar";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";
import CMSVideo from "@/components/SharedComponents/CMSVideo";
import AspectRatio from "@/components/SharedComponents/AspectRatio";

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
      return <CMSVideo video={webinar.video} location="webinar" />;
    case "locked":
      return <WebinarRegistration {...webinarRegistrationProps} />;
  }
};

export default WebinarVideo;
