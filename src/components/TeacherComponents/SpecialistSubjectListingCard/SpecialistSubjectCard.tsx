import { SpecialistSubject } from "../../TeacherViews/SpecialistSubjectListing/SpecialistSubjectListing.view";

import Card from "@/components/SharedComponents/Card";
import SubjectListingTextTile from "@/components/TeacherComponents/SubjectListingTextTile";
import SubjectIcon from "@/components/SharedComponents/SubjectIcon";
import Flex from "@/components/SharedComponents/Flex";
import { Heading, Span } from "@/components/SharedComponents/Typography";
import OwaLink from "@/components/SharedComponents/OwaLink";
import {
  SpecialistProgrammeListingLinkProps,
  SpecialistUnitListingLinkProps,
} from "@/common-lib/urls";

const getSpecialistCardBackgroundColour = (heading: string) => {
  switch (heading) {
    case "Therapies":
      return "mint";
    case "Specialist":
    default:
      return "aqua";
  }
};

const getOakLinkProps = (
  subject: SpecialistSubject,
): SpecialistProgrammeListingLinkProps | SpecialistUnitListingLinkProps =>
  subject.programmeCount > 1
    ? // If there are multiple programmes, link to the programme listing page
      {
        page: "specialist-programme-index",
        subjectSlug: subject.subjectSlug,
      }
    : // If there is only one programme, link to the unit listing page for that programme
      {
        page: "specialist-unit-index",
        programmeSlug: subject.programmeSlug,
      };

const getAriaLabel = (subject: SpecialistSubject) => {
  return `${subject.subjectTitle}: ${subject.unitCount} ${
    subject.unitCount > 1 ? "units" : "unit"
  }, ${subject.lessonCount} ${subject.lessonCount > 1 ? "lessons" : "lesson"}`;
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
          $height={80}
          $width={80}
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
      <OwaLink
        {...getOakLinkProps(props.subject)}
        aria-label={getAriaLabel(props.subject)}
        $hideDefaultFocus
      >
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
      </OwaLink>
    </Flex>
  </Card>
);

export default SpecialistSubjectCard;
