import {
  OakGrid,
  OakGridArea,
  OakHeading,
  OakP,
  OakFlex,
} from "@oaknational/oak-components";

import SpecialistSubjectCard from "@/components/TeacherComponents/SpecialistSubjectListingCard/SpecialistSubjectCard";
import { SpecialistSubject } from "@/node-lib/curriculum-api-2023/queries/specialistSubjectListing/specialistSubjectListing.schema";

const getSpecialistCardBackgroundColour = (heading: string) => {
  switch (heading) {
    case "Therapies":
      return "mint";
    case "Specialist":
    default:
      return "aqua";
  }
};

const SpecialistSubjectCardSection = (props: {
  heading: string;
  summary: string;
  subjects: Array<SpecialistSubject>;
}) => {
  return (
    <OakFlex $flexDirection="column" $gap="spacing-24">
      <OakGrid $rg={"spacing-16"}>
        <OakGridArea $colSpan={[12]}>
          <OakHeading tag="h2" $font="heading-3">
            {props.heading}
          </OakHeading>
        </OakGridArea>
        <OakGridArea $colSpan={[12, 12, 9]}>
          <OakP>{props.summary}</OakP>
        </OakGridArea>
      </OakGrid>
      <OakGrid
        $rg={"spacing-16"}
        $cg={"spacing-16"}
        $gridAutoRows={"1fr"}
        data-testid="specialist-subject-card-section"
      >
        {props.subjects.map((subject, i) => (
          <OakGridArea
            key={`subject-list-item-${subject.subjectSlug}-${i}`}
            $colSpan={[12, 6, 3]}
            data-testid="specialist-subject-card"
          >
            <SpecialistSubjectCard
              subject={subject}
              backgroundColour={getSpecialistCardBackgroundColour(
                props.heading,
              )}
            />
          </OakGridArea>
        ))}
      </OakGrid>
    </OakFlex>
  );
};

export default SpecialistSubjectCardSection;
