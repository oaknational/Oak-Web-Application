import {
  OakHeading,
  OakIcon,
  OakIconName,
  OakSecondaryLink,
  OakLI,
  OakAnchorTarget,
  OakBox,
  OakLink,
  OakFlex,
} from "@oaknational/oak-components";
import styled from "styled-components";

import MyLibraryUnitCard, {
  MyLibraryUnitCardProps,
} from "../MyLibraryUnitCard/MyLibraryUnitCard";

const StyledLink = styled(OakSecondaryLink)`
  text-decoration: none;
  display: flex;

  &:hover {
    text-decoration: underline;
  }
`;

const ProgrammeHeader = ({
  headingIdString,
  programmeTitle,
  iconName,
}: {
  headingIdString: string;
  programmeTitle: string;
  iconName: OakIconName;
}) => {
  return (
    <OakFlex
      $gap={["space-between-ssx", "space-between-ssx"]}
      $alignItems={"center"}
    >
      <OakIcon
        $width={["all-spacing-11", "all-spacing-15"]}
        $height={["all-spacing-11", "all-spacing-15"]}
        iconName={iconName}
        data-testid="subjectIcon"
      />
      <OakHeading
        tag="h2"
        $font={["heading-6", "heading-4"]}
        $color="text-primary"
        id={headingIdString}
      >
        {programmeTitle}
      </OakHeading>
      <OakIcon
        iconName={"chevron-right"}
        $width={["all-spacing-6", "all-spacing-9"]}
        $height={["all-spacing-6", "all-spacing-9"]}
      />
    </OakFlex>
  );
};

interface MyLibraryProgrammeCardProps {
  programmeTitle: string;
  programmeHref: string;
  anchorId: string;
  iconName: OakIconName;
  savedUnits: Array<MyLibraryUnitCardProps>;
  trackBrowseRefined: () => void;
}

export default function MyLibraryProgrammeCard(
  props: Readonly<MyLibraryProgrammeCardProps>,
) {
  const {
    savedUnits,
    programmeTitle,
    programmeHref,
    iconName,
    anchorId,
    trackBrowseRefined,
  } = props;

  const headingIdString = `programme-heading-${programmeTitle.split(" ").join("-").toLowerCase()}`;

  return (
    <OakFlex
      $flexDirection={"column"}
      $borderRadius={"border-radius-l"}
      $background={"bg-decorative1-subdued"}
      $pa={["inner-padding-xs", "inner-padding-l", "inner-padding-xl"]}
      $maxWidth={"all-spacing-23"}
      $gap={["space-between-ssx", "space-between-m"]}
      $position="relative"
    >
      <OakAnchorTarget id={anchorId} />
      <StyledLink href={programmeHref} onClick={trackBrowseRefined}>
        <ProgrammeHeader
          headingIdString={headingIdString}
          iconName={iconName}
          programmeTitle={programmeTitle}
        />
      </StyledLink>
      <OakFlex
        as="ul"
        $gap="space-between-m2"
        $flexDirection="column"
        $pl="inner-padding-none"
        aria-labelledby={headingIdString}
      >
        {savedUnits.map((unit) => (
          <OakLI $listStyle="none" key={unit.unitSlug}>
            <MyLibraryUnitCard
              key={unit.unitSlug}
              unitTitle={unit.unitTitle}
              optionalityTitle={unit.optionalityTitle}
              unitSlug={unit.unitSlug}
              programmeSlug={unit.programmeSlug}
              year={unit.year}
              savedAt={unit.savedAt}
              lessons={unit.lessons}
              onSave={unit.onSave}
              isSaved={unit.isSaved}
              isSaving={unit.isSaving}
              trackUnitAccessed={unit.trackUnitAccessed}
              trackLessonAccessed={unit.trackLessonAccessed}
            />
          </OakLI>
        ))}
      </OakFlex>
      <OakBox $display={["block", "none"]} $pv="inner-padding-xs">
        <OakLink isTrailingIcon iconName="arrow-up" href="#collections-menu">
          Back to collections
        </OakLink>
      </OakBox>
    </OakFlex>
  );
}
