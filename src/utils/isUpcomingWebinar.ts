import { isFuture } from "date-fns";

import errorReporter from "../common-lib/error-reporter";
import { SerializedWebinar } from "../pages/webinars/[webinarSlug]";

const reportError = errorReporter("isUpcomingWebinar");

const isUpcomingWebinar = (webinar: Pick<SerializedWebinar, "date">) => {
  try {
    const date = new Date(webinar.date);
    return isFuture(date);
  } catch (error) {
    reportError(error, webinar);
    return false;
  }
};

export default isUpcomingWebinar;
