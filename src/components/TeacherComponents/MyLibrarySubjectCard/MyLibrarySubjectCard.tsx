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
import { getValidSubjectIconName } from "../../../utils/getValidSubjectIconName";
import { toSentenceCase } from "../../../node-lib/curriculum-api-2023/helpers";

interface MyLibrarySubjectCardProps {
  keyStage: string;
  subject: string;
  savedUnits: Array<MyLibraryUnitCardProps>;
}

const StyledLink = styled(OakSecondaryLink)`
  text-decoration: none;
  display: flex;

  &:hover {
    text-decoration: underline;
  }
`;

const SubjectHeader = ({
  subject,
  keyStage,
}: {
  subject: string;
  keyStage: string;
}) => {
  const subjectIconName = getValidSubjectIconName(subject);
  const formattedTitle = `${toSentenceCase(subject)} ${keyStage}`;

  return (
    <StyledLink>
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
          <OakIcon
            $height={"100%"}
            $width={"100%"}
            iconName={subjectIconName}
          />
        </OakFlex>
        <OakHeading tag="h4" $font={["heading-6", "heading-4"]}>
          {formattedTitle}
        </OakHeading>
        <OakFlex
          $width={["all-spacing-6", "all-spacing-9"]}
          $height={["all-spacing-6", "all-spacing-9"]}
          $alignItems={"center"}
          $justifyContent={"center"}
        >
          <OakIcon
            iconName={"chevron-right"}
            $height={"100%"}
            $width={"100%"}
          />
        </OakFlex>
      </OakFlex>
    </StyledLink>
  );
};

export default function MyLibrarySubjectCard(props: MyLibrarySubjectCardProps) {
  const { savedUnits, subject, keyStage } = props;

  return (
    <OakFlex
      $flexDirection={"column"}
      $borderRadius={"border-radius-l"}
      $background={"bg-decorative1-subdued"}
      $pa={["inner-padding-xs", "inner-padding-l", "inner-padding-xl"]}
      $maxWidth={"all-spacing-23"}
      $gap={["space-between-ssx", "space-between-m"]}
    >
      <SubjectHeader subject={subject} keyStage={keyStage} />
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
