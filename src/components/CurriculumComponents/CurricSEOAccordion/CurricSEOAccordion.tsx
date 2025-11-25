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
}: Readonly<CurricSEOAccordionProps>) {
  const isMobile = useMediaQuery("mobile");
  const displaySubjectTitle = subjectTitleWithCase(subject.title);
  const truncationLength = isMobile ? 40 : 100;

  return (
    <OakBox $ph={["spacing-12", "spacing-0"]}>
      <OakHandDrawnHR
        hrColor={"grey40"}
        $mv={"spacing-4"}
        $height={"spacing-2"}
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
        <OakBox $mt="spacing-24">
          <PortableText
            value={curriculumSeoText}
            components={basePortableTextComponents}
          />
        </OakBox>
      </OakBasicAccordion>
      <OakHandDrawnHR
        hrColor={"grey40"}
        $mt={"spacing-4"}
        $height={"spacing-2"}
      />
    </OakBox>
  );
}
