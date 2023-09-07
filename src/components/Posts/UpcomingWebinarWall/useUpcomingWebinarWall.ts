import getBrowserConfig from "../../../browser-lib/getBrowserConfig";
import { SerializedWebinar } from "../../../pages/webinars/[webinarSlug]";
import formatDate from "../../../utils/formatDate";

import { UpcomingWebinarWallProps } from "./UpcomingWebinarWall";

const useUpcomingWebinarWall = (
  webinar: SerializedWebinar,
): UpcomingWebinarWallProps => {
  return {
    headingText: `Starts at ${formatDate(webinar.date, {
      hour: "2-digit",
      minute: "2-digit",
    })} (UK time)`,
    buttonOnClick: () => {
      // tracking
    },
    buttonHref: getBrowserConfig("webinarSignUpUrl"),
    buttonText: "Save my place",
    buttonSuffixA11y: "on the webinar",
  };
};

export default useUpcomingWebinarWall;
