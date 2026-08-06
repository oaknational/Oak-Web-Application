import {
  OakGrid,
  OakGridArea,
  OakInlineBanner,
  OakLink,
} from "@oaknational/oak-components";

import { resolveOakHref } from "@/common-lib/urls";

type ImplementationGuideCalloutProps = {
  subject: string;
  phase: string;
  subjectTitle: string;
  phaseTitle: string;
};
export function ImplementationGuideCallout({
  subject,
  phase,
  subjectTitle,
  phaseTitle,
}: Readonly<ImplementationGuideCalloutProps>) {
  const linkHref = resolveOakHref({
    page: "teacher-programme",
    tab: "downloads",
    subjectPhaseSlug: `${subject}-${phase}`,
  });

  return (
    <OakGrid $pt={["spacing-24", "spacing-32", "spacing-32"]}>
      <OakGridArea $colStart={[1, 3, 3]} $colSpan={[12, 8, 8]}>
        <OakInlineBanner
          isOpen
          title="Information"
          type="info"
          variant="regular"
          message={`Leading your school's use of Oak's ${subjectTitle} ${phaseTitle} curriculum? Download our implementation toolkit.`}
          cta={
            <OakLink
              href={linkHref}
              iconName="chevron-right"
              isTrailingIcon
              variant="secondary"
            >
              Download
            </OakLink>
          }
        />
      </OakGridArea>
    </OakGrid>
  );
}
