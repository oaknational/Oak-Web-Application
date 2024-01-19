import { SpecialistSubject } from "../../TeacherViews/SpecialistSubjectListing/SpecialistSubjectListing.view";
import SpecialistSubjectCard from "../SpecialistSubjectListingCard/SpecialistSubjectCard";

import Flex from "@/components/SharedComponents/Flex";
import { Heading, P } from "@/components/SharedComponents/Typography";
import { GridList } from "@/components/SharedComponents/Typography/UL";
import { GridAreaListItem } from "@/components/SharedComponents/Typography/LI";

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
    <Flex $flexDirection="column" $gap={24}>
      <Flex $flexDirection="column" $gap={16} $maxWidth={["100%", "70%"]}>
        <Heading tag="h3" $font="heading-3">
          {props.heading}
        </Heading>
        <P>{props.summary}</P>
      </Flex>
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
    </Flex>
  );
};

export default SpecialistSubjectCardSection;
