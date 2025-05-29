import {
  OakBasicAccordion,
  OakBox,
  OakHandDrawnHR,
  OakHeading,
  OakP,
} from "@oaknational/oak-components";
import { PortableText, PortableTextBlock } from "@portabletext/react";

import { basePortableTextComponents } from "@/components/SharedComponents/PortableText";
import {
  subjectTitleWithCase,
  truncatePortableTextBlock,
} from "@/utils/curriculum/formatting";
import useMediaQuery from "@/hooks/useMediaQuery";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";

type CurricSEOAccordionProps = {
  curriculumSeoText: PortableTextBlock[];
  subject: SubjectPhasePickerData["subjects"][number];
};

export default function CurricSEOAccordion({
  curriculumSeoText,
  subject,
}: CurricSEOAccordionProps) {
  const isMobile = useMediaQuery("mobile");
  const displaySubjectTitle = subjectTitleWithCase(subject.title);
  const truncationLength = isMobile ? 40 : 100;

  return (
    <>
      <OakBox $ph={["inner-padding-s", "inner-padding-none"]}>
        <OakHandDrawnHR
          hrColor={"grey40"}
          $mv={"space-between-sssx"}
          $height={"all-spacing-05"}
        />
        <OakBasicAccordion
          header={
            <OakHeading $font="heading-5" tag="h3" $textAlign="left">
              How to plan your {displaySubjectTitle} curriculum with Oak
            </OakHeading>
          }
          subheading={
            <>
              <br />
              <OakP $font={["body-2", "body-1"]} $textAlign="left">
                {truncatePortableTextBlock(curriculumSeoText, truncationLength)}
              </OakP>
            </>
          }
          initialOpen={false}
          id="curriculum-seo-accordion"
        >
          <OakBox $mt="space-between-m">
            <PortableText
              value={curriculumSeoText}
              components={basePortableTextComponents}
            />
          </OakBox>
        </OakBasicAccordion>
        <OakHandDrawnHR
          hrColor={"grey40"}
          $mt={"space-between-sssx"}
          $height={"all-spacing-05"}
        />
      </OakBox>
    </>
  );
}
