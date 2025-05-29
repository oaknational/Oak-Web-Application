import {
  OakFlex,
  OakHeading,
  OakIcon,
  OakSecondaryLink,
} from "@oaknational/oak-components";
import styled from "styled-components";

import MyLibraryUnitCard, {
  MyLibraryUnitCardProps,
} from "../MyLibraryUnitCard/MyLibraryUnitCard";

import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";
import { resolveOakHref } from "@/common-lib/urls";

const StyledLink = styled(OakSecondaryLink)`
  text-decoration: none;
  display: flex;

  &:hover {
    text-decoration: underline;
  }
`;

const ProgrammeHeader = ({
  programmeTitle,
  subject,
}: {
  programmeTitle: string;
  subject: string;
}) => {
  const subjectIconName = getValidSubjectIconName(subject);
  return (
    <OakFlex
      $gap={["space-between-ssx", "space-between-ssx"]}
      $alignItems={"center"}
    >
      <OakFlex
        $width={["all-spacing-11", "all-spacing-15"]}
        $height={["all-spacing-11", "all-spacing-15"]}
        $alignItems={"center"}
        $justifyContent={"center"}
      >
        <OakIcon $height={"100%"} $width={"100%"} iconName={subjectIconName} />
      </OakFlex>
      <OakHeading tag="h4" $font={["heading-6", "heading-4"]}>
        {programmeTitle}
      </OakHeading>
      <OakFlex
        $width={["all-spacing-6", "all-spacing-9"]}
        $height={["all-spacing-6", "all-spacing-9"]}
        $alignItems={"center"}
        $justifyContent={"center"}
      >
        <OakIcon iconName={"chevron-right"} $height={"100%"} $width={"100%"} />
      </OakFlex>
    </OakFlex>
  );
};

interface MyLibraryProgrammeCardProps {
  programmeTitle: string;
  programmeSlug: string;
  subject: string;
  savedUnits: Array<MyLibraryUnitCardProps>;
}

export default function MyLibraryProgrammeCard(
  props: MyLibraryProgrammeCardProps,
) {
  const { savedUnits, programmeSlug, programmeTitle, subject } = props;
  const href = resolveOakHref({ page: "unit-index", programmeSlug });
  return (
    <OakFlex
      $flexDirection={"column"}
      $borderRadius={"border-radius-l"}
      $background={"bg-decorative1-subdued"}
      $pa={["inner-padding-xs", "inner-padding-l", "inner-padding-xl"]}
      $maxWidth={"all-spacing-23"}
      $gap={["space-between-ssx", "space-between-m"]}
    >
      <StyledLink href={href}>
        <ProgrammeHeader subject={subject} programmeTitle={programmeTitle} />
      </StyledLink>
      {savedUnits.map((unit) => (
        <MyLibraryUnitCard
          key={unit.unitSlug}
          index={unit.index}
          unitTitle={unit.unitTitle}
          unitSlug={unit.unitSlug}
          programmeSlug={unit.programmeSlug}
          yearTitle={unit.yearTitle}
          saveTime={unit.saveTime}
          href={unit.href}
          lessons={unit.lessons}
          onSave={unit.onSave}
          isSaved={unit.isSaved}
        />
      ))}
    </OakFlex>
  );
}
