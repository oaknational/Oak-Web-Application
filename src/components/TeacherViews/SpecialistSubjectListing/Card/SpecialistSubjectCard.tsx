import { SpecialistSubject } from "../SpecialistSubjectListing.view";

import Card from "@/components/SharedComponents/Card";
import SubjectListingTextTile from "@/components/TeacherComponents/SubjectListingTextTile";
import SubjectIcon from "@/components/SharedComponents/SubjectIcon";
import Flex from "@/components/SharedComponents/Flex";
import { Heading, Span } from "@/components/SharedComponents/Typography";

const getSpecialistCardBackgroundColour = (heading: string) => {
  switch (heading) {
    case "Therapies":
      return "mint";
    case "Specialist":
    default:
      return "aqua";
  }
};

const SpecialistSubjectCard = (props: {
  subject: SpecialistSubject;
  heading: string;
}) => (
  <Card
    $background={getSpecialistCardBackgroundColour(props.heading)}
    $borderRadius={4}
    $pa={16}
    $height="100%"
    data-testid={`${props.heading.toLowerCase()}-subject-card`}
  >
    <Flex
      $flexDirection="column"
      $alignItems={"stretch"}
      $justifyContent="space-between"
      $height="100%"
      $gap={20}
    >
      <Flex
        $flexDirection={["row", "column"]}
        $alignItems="center"
        $flex={2}
        $justifyContent={["flex-start", "space-between"]}
        $gap={[8, 0]}
      >
        <SubjectIcon
          subjectSlug={props.subject.subjectSlug}
          $width={80}
          height={80}
        />
        <Heading
          $textAlign={["start", "center"]}
          $font={["heading-6", "heading-5"]}
          tag={"h6"}
          $ma={0}
        >
          {props.subject.subjectTitle}
        </Heading>
      </Flex>
      <SubjectListingTextTile>
        <Flex $flexDirection={"column"} $pa={16}>
          <Flex>
            <Span>
              {`${props.subject.unitCount} ${
                props.subject.unitCount > 1 ? "units" : "unit"
              }`}
            </Span>
          </Flex>
          <Span>{`${props.subject.lessonCount} ${
            props.subject.lessonCount > 1 ? "lessons" : "lesson"
          }`}</Span>
        </Flex>
      </SubjectListingTextTile>
    </Flex>
  </Card>
);

export default SpecialistSubjectCard;
