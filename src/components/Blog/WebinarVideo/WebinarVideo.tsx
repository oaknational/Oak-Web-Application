import { SerializedWebinar } from "../../../pages/beta/webinars/[webinarSlug]";
import AspectRatio from "../../AspectRatio";
import CMSVideo from "../../CMSVideo";
import BoxBorders from "../../SpriteSheet/BrushSvgs/BoxBorders";
import WebinarRegistration, {
  useWebinarRegistration,
} from "../WebinarRegistration";

type WebinarVideoProps = {
  webinar: Pick<SerializedWebinar, "video">;
};
/**
 * Displays the `WebinarRegistration` form to the user if they've never submitted
 * it. Else it shows them the video, using `CMSVideo` component.
 *
 * There is a "pending" state for server rendering, which shows a 16:9 white
 * box with borders.
 *
 **/
const WebinarVideo = (props: WebinarVideoProps) => {
  const { webinar } = props;
  const { webinarLockState, webinarRegistrationProps } =
    useWebinarRegistration();

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
