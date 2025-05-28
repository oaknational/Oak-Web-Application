import {
  OakAnchorTarget,
  OakBox,
  OakFlex,
  OakHeading,
  OakIcon,
  OakLink,
  OakSecondaryLink,
} from "@oaknational/oak-components";
import styled from "styled-components";

import MyLibraryUnitCard, {
  MyLibraryUnitCardProps,
} from "../MyLibraryUnitCard/MyLibraryUnitCard";
import { getValidSubjectIconName } from "../../../utils/getValidSubjectIconName";

interface MyLibrarySubjectCardProps {
  subjectSlug: string;
  programmeTitle: string;
  programmeHref: string;
  programmeSlug: string;
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
  subjectSlug,
  programmeTitle,
  programmeHref,
}: {
  subjectSlug: string;
  programmeTitle: string;
  programmeHref: string;
}) => {
  const subjectIconName = getValidSubjectIconName(subjectSlug);

  return (
    <StyledLink href={programmeHref}>
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
        <OakHeading
          tag="h4"
          $font={["heading-6", "heading-4"]}
          $color="text-primary"
        >
          {programmeTitle}
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
  const {
    savedUnits,
    subjectSlug,
    programmeTitle,
    programmeHref,
    programmeSlug,
  } = props;

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
      <OakAnchorTarget id={programmeSlug} />
      <SubjectHeader
        subjectSlug={subjectSlug}
        programmeTitle={programmeTitle}
        programmeHref={programmeHref}
      />
      {savedUnits.map((unit) => (
        <MyLibraryUnitCard {...unit} />
      ))}
      <OakBox $display={["block", "none"]} $pv="inner-padding-xs">
        <OakLink isTrailingIcon iconName="arrow-up" href="#collections-menu">
          Back to collections
        </OakLink>
      </OakBox>
    </OakFlex>
  );
}
