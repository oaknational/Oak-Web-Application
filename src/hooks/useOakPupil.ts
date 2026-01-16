import { useContext } from "react";

import errorReporter from "@/common-lib/error-reporter";
import { oakPupilContext } from "@/context/Pupil/OakPupilClientProvider";

function useOakPupil() {
  const context = useContext(oakPupilContext);
  if (!context) {
    errorReporter("useOakPupil must be used within a OakPupilProvider");
  }
  return context;
}

export { useOakPupil };
