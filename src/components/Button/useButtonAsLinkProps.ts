import { KeyboardEvent } from "react";

import createErrorHandler from "../../common-lib/error-handler";
import OakError from "../../errors/OakError";

const handleError = createErrorHandler("IconButtonAsLink");

const useButtonAsLinkProps = () => {
  const onKeyDown = (e: KeyboardEvent<HTMLAnchorElement>) => {
    if (e.code === "Space" || e.keyCode === 32) {
      e.preventDefault();
      // trigger the target's click event
      if (!(e.target instanceof HTMLElement)) {
        const error = new OakError({ code: "misc/unexpected-type" });
        return handleError(error);
      }
      e.target.click();
    }
  };

  return {
    onKeyDown,
    role: "button",
  };
};

export default useButtonAsLinkProps;
