import { KeyboardEvent } from "react";

import errorReporter from "../../../common-lib/error-reporter";
import OakError from "../../../errors/OakError";

const reportError = errorReporter("IconButtonAsLink");
/**
 * Links which look like buttons can be a bit of an a11y nightmare.
 * Although there's not one clear right way to do it, we make them
 * interact like buttons (activated by 'space', and have role="link").
 * There's extensive discussion on the topic on govuk github.
 * @see https://github.com/alphagov/govuk_elements/pull/272#issuecomment-233114678
 * @see https://github.com/oaknational/Oak-Web-Application/issues/253
 */
const useButtonAsLinkProps = () => {
  const onKeyDown = (e: KeyboardEvent<HTMLAnchorElement>) => {
    if (e.code === "Space" || e.keyCode === 32) {
      e.preventDefault();
      // trigger the target's click event
      if (!(e.target instanceof HTMLElement)) {
        const error = new OakError({ code: "misc/unexpected-type" });
        return reportError(error);
      }
      e.target.click();
    }
  };

  return {
    onKeyDown,
    role: "link",
  };
};

export default useButtonAsLinkProps;
