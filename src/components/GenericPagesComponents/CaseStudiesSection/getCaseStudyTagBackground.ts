import { OakUiRoleToken } from "@oaknational/oak-components";

import { CaseStudy } from "@/common-lib/cms-types/caseStudy";

export const getCaseStudyTagBackground = (
  tag: CaseStudy["tag"],
): OakUiRoleToken | undefined => {
  if (tag === "secondary") {
    return "bg-decorative1-main";
  }
  if (tag === "primary") {
    return "bg-decorative4-main";
  }
  return undefined;
};
