import { isFuture } from "date-fns";

import errorReporter from "../common-lib/error-reporter";
import { SerializedWebinar } from "../pages/beta/webinars/[webinarSlug]";

const reportError = errorReporter("isFutureWebinar");
const isFutureWebinar = (webinar: Pick<SerializedWebinar, "date">) => {
  try {
    const date = new Date(webinar.date);
    return isFuture(date);
  } catch (error) {
    reportError(error, webinar);
    return false;
  }
};

export default isFutureWebinar;
