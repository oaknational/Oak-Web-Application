import { SpecialistSubject } from "./SpecialistSubjectListing.view";

import Card from "@/components/SharedComponents/Card";
import SubjectListingTextTile from "@/components/TeacherComponents/SubjectListingTextTile";
import SubjectIcon from "@/components/SharedComponents/SubjectIcon";
import Flex from "@/components/SharedComponents/Flex";
import { Heading, P, Span } from "@/components/SharedComponents/Typography";
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

const SpecialistSubjectCard = (props: {
  subject: SpecialistSubject;
  heading: string;
}) => (
  <Card
    $background={getSpecialistCardBackgroundColour(props.heading)}
    $borderRadius={4}
    $pa={12}
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

export const SpecialistSubjectCards = (props: {
  heading: string;
  summary: string;
  subjects: Array<SpecialistSubject>;
}) => {
  return (
    <Flex $flexDirection="column" $gap={24}>
      <Flex $flexDirection="column" $gap={16}>
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
            <SpecialistSubjectCard subject={subject} heading={props.heading} />
          </GridAreaListItem>
        ))}
      </GridList>
    </Flex>
  );
};
