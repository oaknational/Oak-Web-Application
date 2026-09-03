import {
  OakGrid,
  OakGridArea,
  OakInlineBanner,
  OakLink,
  OakBox,
} from "@oaknational/oak-components";

import { subjectTitleWithCase } from "@/utils/curriculum/formatting";
import { resolveOakHref } from "@/common-lib/urls";
import { useCookieFlag } from "@/hooks/useCookieFlag/useCookieFlag";
import { cookieFlagNames } from "@/config/cookieFlagNames";

type ImplementationGuideCalloutProps = {
  subject: string;
  phase: string;
  subjectTitle: string;
  phaseTitle: string;
  activeFlags: string[];
  onClick: () => void;
};
export function ImplementationGuideCallout({
  subject,
  phase,
  subjectTitle,
  phaseTitle,
  activeFlags,
  onClick,
}: Readonly<ImplementationGuideCalloutProps>) {
  const [bannerDismissed, setBannerDismissed] = useCookieFlag(
    "toolkit-modal-dismissed",
    {
      flags: cookieFlagNames,
      activeFlags,
    },
  );
  const linkHref = resolveOakHref({
    page: "teacher-programme",
    tab: "download",
    subjectPhaseSlug: `${subject}-${phase}`,
  });

  if (bannerDismissed) {
    return;
  }

  return (
    <OakGrid $pt={["spacing-24", "spacing-32", "spacing-32"]}>
      <OakGridArea $colStart={[1, 3, 3]} $colSpan={[12, 8, 8]}>
        <OakInlineBanner
          isOpen
          type="info"
          variant="regular"
          canDismiss={true}
          onDismiss={() => setBannerDismissed(true)}
          message={`Leading your school's use of Oak's ${subjectTitleWithCase(subjectTitle)} ${phaseTitle.toLowerCase()} curriculum? Download our implementation toolkit.`}
          cta={
            <OakBox $whiteSpace="nowrap">
              <OakLink
                href={linkHref}
                iconName="chevron-right"
                isTrailingIcon
                variant="secondary"
                aria-label="Download our implementation toolkit"
                onClick={onClick}
              >
                Download
              </OakLink>
            </OakBox>
          }
        />
      </OakGridArea>
    </OakGrid>
  );
}
