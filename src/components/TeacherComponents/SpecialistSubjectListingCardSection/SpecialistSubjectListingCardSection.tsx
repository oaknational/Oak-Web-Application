import {
  OakGrid,
  OakGridArea,
  OakHeading,
  OakP,
  OakFlex,
} from "@oaknational/oak-components";

import { GridList } from "@/components/SharedComponents/Typography/UL.deprecated";
import { GridAreaListItem } from "@/components/SharedComponents/Typography/LI.deprecated";
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
    <OakFlex $flexDirection="column" $gap="all-spacing-6">
      <OakGrid $rg={"all-spacing-4"}>
        <OakGridArea $colSpan={[12]}>
          <OakHeading tag="h2" $font="heading-3">
            {props.heading}
          </OakHeading>
        </OakGridArea>
        <OakGridArea $colSpan={[12, 12, 9]}>
          <OakP>{props.summary}</OakP>
        </OakGridArea>
      </OakGrid>
      <GridList $rg={16} $cg={16} $gridAutoRows={"1fr"}>
        {props.subjects.map((subject, i) => (
          <GridAreaListItem
            key={`subject-list-item-${subject.subjectSlug}-${i}`}
            $colSpan={[12, 6, 3]}
          >
            <SpecialistSubjectCard
              subject={subject}
              backgroundColour={getSpecialistCardBackgroundColour(
                props.heading,
              )}
            />
          </GridAreaListItem>
        ))}
      </GridList>
    </OakFlex>
  );
};

export default SpecialistSubjectCardSection;
