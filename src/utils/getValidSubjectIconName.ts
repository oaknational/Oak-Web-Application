import { OakIconName, isValidIconName } from "@oaknational/oak-components";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";

export const getValidSubjectIconName = (
  subject: string | null,
): OakIconName => {
  const subjectIconName = `subject-${subject}`;
  if (!isValidIconName(subjectIconName)) {
    const reportError = errorReporter("generateSubjectIconName");
    reportError(
      new OakError({
        code: "oak-components/invalid-icon-name",
        meta: { iconName: subjectIconName },
      }),
    );
    // fallback icon
    return "books";
  }
  return subjectIconName;
};
