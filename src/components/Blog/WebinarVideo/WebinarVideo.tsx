import { SerializedWebinar } from "../../../pages/beta/webinars/[webinarSlug]";
import AspectRatio from "../../AspectRatio";
import CMSVideo from "../../CMSVideo";
import BoxBorders from "../../SpriteSheet/BrushSvgs/BoxBorders";
import WebinarRegistration, {
  useWebinarRegistration,
} from "../WebinarRegistration";
import isFutureWebinar from "../../../utils/isFutureWebinar";
import UpcomingWebinarWall from "../UpcomingWebinarWall";

type WebinarVideoProps = {
  webinar: Pick<SerializedWebinar, "video" | "date">;
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

  if (isFutureWebinar(webinar)) {
    return (
      <AspectRatio ratio="16:9">
        <BoxBorders />
        {/* <UpcomingWebinarWall
          buttonHref={"https://share.hsforms.com/1USsrkazESq2Il8lxUx_vPgbvumd"}
        /> */}
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
      return <CMSVideo video={webinar.video} />;
    case "locked":
      return <WebinarRegistration {...webinarRegistrationProps} />;
  }
};

export default WebinarVideo;
