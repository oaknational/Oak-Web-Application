import {
  OakHeading,
  OakSpan,
  OakFlex,
  OakIcon,
  isValidIconName,
} from "@oaknational/oak-components";

import Card from "@/components/SharedComponents/Card";
import SubjectListingTextTile from "@/components/TeacherComponents/SubjectListingTextTile";
import OwaLink from "@/components/SharedComponents/OwaLink";
import {
  SpecialistProgrammeListingLinkProps,
  SpecialistUnitListingLinkProps,
} from "@/common-lib/urls";
import { OakColorName } from "@/styles/theme";
import { SpecialistSubject } from "@/node-lib/curriculum-api-2023/queries/specialistSubjectListing/specialistSubjectListing.schema";

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
        programmeSlug: subject.subjectSlug,
      };

const getAriaLabel = (subject: SpecialistSubject) => {
  return `${subject.subjectTitle}: ${subject.unitCount} ${
    subject.unitCount > 1 ? "units" : "unit"
  }, ${subject.lessonCount} ${subject.lessonCount > 1 ? "lessons" : "lesson"}`;
};

const getSentenceCase = (str: string) =>
  `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`;

const SpecialistSubjectCard = (props: {
  subject: SpecialistSubject;
  backgroundColour: OakColorName;
}) => {
  const subjectIconName = `subject-${props.subject.subjectSlug}`;

  return (
    <Card
      $background={props.backgroundColour}
      $borderRadius={4}
      $pa={16}
      $height="100%"
    >
      <OakFlex
        $flexDirection="column"
        $alignItems={"stretch"}
        $justifyContent="space-between"
        $height="100%"
        $gap="all-spacing-5"
      >
        <OakFlex
          $flexDirection={["row", "column"]}
          $alignItems="center"
          $flexGrow={2}
          $justifyContent={["flex-start", "space-between"]}
          $gap={["space-between-ssx", "space-between-none"]}
        >
          <OakIcon
            iconName={
              isValidIconName(subjectIconName) ? subjectIconName : "error"
            }
            $width={["all-spacing-11", "all-spacing-13"]}
            $height={["all-spacing-11", "all-spacing-13"]}
          />

          <OakHeading
            $textAlign={["start", "center"]}
            $font={["heading-6", "heading-5"]}
            tag={"h6"}
            $ma="space-between-none"
          >
            {getSentenceCase(props.subject.subjectTitle)}
          </OakHeading>
        </OakFlex>
        <OwaLink
          {...getOakLinkProps(props.subject)}
          aria-label={getAriaLabel(props.subject)}
          $hideDefaultFocus
        >
          <SubjectListingTextTile>
            <OakFlex $flexDirection={"column"} $pa="inner-padding-m">
              <OakFlex>
                <OakSpan>
                  {`${props.subject.unitCount} ${
                    props.subject.unitCount > 1 ? "units" : "unit"
                  }`}
                </OakSpan>
              </OakFlex>
              <OakSpan>{`${props.subject.lessonCount} ${
                props.subject.lessonCount > 1 ? "lessons" : "lesson"
              }`}</OakSpan>
            </OakFlex>
          </SubjectListingTextTile>
        </OwaLink>
      </OakFlex>
    </Card>
  );
};

export default SpecialistSubjectCard;
