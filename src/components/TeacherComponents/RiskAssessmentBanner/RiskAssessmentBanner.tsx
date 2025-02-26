import { FC } from "react";
import { OakBox, OakInlineBanner, OakLink } from "@oaknational/oak-components";

import { resolveOakHref } from "@/common-lib/urls";

const RiskAssessmentBanner: FC = () => (
  <OakInlineBanner
    isOpen
    icon="info"
    type="info"
    message={riskAssessmentMessage}
    $width="100%"
  />
);

const riskAssessmentMessage = (
  <OakBox>
    Carry out a{" "}
    <OakLink
      href={resolveOakHref({
        page: "legal",
        legalSlug: "physical-activity-disclaimer",
      })}
      target="_blank"
    >
      risk assessment
    </OakLink>{" "}
    for all practical PE lessons. Read{" "}
    <OakLink
      href="https://www.afpe.org.uk/page/Safe_Practice_in_PESSPA#"
      target="_blank"
      aria-label="Safe Practice: in PESSPA (opens in a new tab)"
      iconName="external"
      isTrailingIcon
    >
      'Safe Practice: in PESSPA'
    </OakLink>{" "}
    for further support.
  </OakBox>
);

export default RiskAssessmentBanner;
