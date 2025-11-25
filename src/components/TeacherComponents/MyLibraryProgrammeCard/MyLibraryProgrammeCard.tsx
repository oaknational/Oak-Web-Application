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
    <OakFlex $gap={["spacing-8", "spacing-8"]} $alignItems={"center"}>
      <OakIcon
        $width={["spacing-64", "spacing-100"]}
        $height={["spacing-64", "spacing-100"]}
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
        $width={["spacing-24", "spacing-48"]}
        $height={["spacing-24", "spacing-48"]}
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
      $pa={["spacing-8", "spacing-20", "spacing-24"]}
      $maxWidth={"spacing-960"}
      $gap={["spacing-8", "spacing-24"]}
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
        $gap="spacing-32"
        $flexDirection="column"
        $pl="spacing-0"
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
      <OakBox $display={["block", "none"]} $pv="spacing-8">
        <OakLink isTrailingIcon iconName="arrow-up" href="#collections-menu">
          Back to collections
        </OakLink>
      </OakBox>
    </OakFlex>
  );
}
