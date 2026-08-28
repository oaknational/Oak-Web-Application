import {
  OakGrid,
  OakGridArea,
  OakInlineBanner,
  OakLink,
  OakBox,
} from "@oaknational/oak-components";

import { subjectTitleWithCase } from "@/utils/curriculum/formatting";
import { resolveOakHref } from "@/common-lib/urls";

type ImplementationGuideCalloutProps = {
  subject: string;
  phase: string;
  subjectTitle: string;
  phaseTitle: string;
  onClick: () => void;
};
export function ImplementationGuideCallout({
  subject,
  phase,
  subjectTitle,
  phaseTitle,
  onClick,
}: Readonly<ImplementationGuideCalloutProps>) {
  const linkHref = resolveOakHref({
    page: "teacher-programme",
    tab: "download",
    subjectPhaseSlug: `${subject}-${phase}`,
  });

  return (
    <OakGrid $pt={["spacing-24", "spacing-32", "spacing-32"]}>
      <OakGridArea $colStart={[1, 3, 3]} $colSpan={[12, 8, 8]}>
        <OakInlineBanner
          isOpen
          type="info"
          variant="regular"
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
