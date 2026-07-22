import Link from "next/link";
import {
  OakHeading,
  OakHeadingTag,
  OakSpan,
  OakFlex,
  OakTertiaryButton,
} from "@oaknational/oak-components";

import { TagFunctional } from "@/components/SharedComponents/TagFunctional";
import { TagColor } from "@/components/SharedComponents/TagFunctional/TagFunctional";
import { resolveOakHref } from "@/common-lib/urls";

type LessonAppearsInPathwayCardProps = {
  headingTag: OakHeadingTag;
  examBoardTagColor: TagColor;
  unitSlug: string;
  examBoardTitle?: string | null;
  examBoardSlug?: string | null;
  subjectTitle: string;
  subjectSlug: string;
  tiers: {
    programmeSlug: string;
    tierTitle?: string | null;
    tierSlug?: string | null;
  }[];
};
export function LessonAppearsInPathwayCard(
  props: Readonly<LessonAppearsInPathwayCardProps>,
) {
  const {
    headingTag,
    examBoardTagColor,
    examBoardTitle,
    subjectTitle,
    unitSlug,
    tiers,
  } = props;

  return (
    <OakFlex
      $flexDirection={["column"]}
      $background="bg-primary"
      $borderRadius="border-radius-s"
    >
      <OakHeading tag={headingTag}>
        <OakFlex $flexDirection={["row"]} $pa="spacing-16">
          {examBoardTitle && (
            <TagFunctional
              text={examBoardTitle}
              color={examBoardTagColor}
              $mr="spacing-8"
            />
          )}
          <OakSpan $font="heading-5">{subjectTitle}</OakSpan>
        </OakFlex>
      </OakHeading>
      <OakFlex
        $flexDirection={["row"]}
        $pa="spacing-16"
        $flexWrap="wrap"
        $gap={"spacing-24"}
      >
        {tiers.map(({ tierTitle, programmeSlug }) => {
          const label = tierTitle ? `Show ${tierTitle} unit` : "Show unit";
          return (
            <OakTertiaryButton
              element={Link}
              key={`tier-${programmeSlug}-${unitSlug}`}
              href={resolveOakHref({
                page: "unit-overview",
                programmeSlug,
                unitSlug,
              })}
              iconName="chevron-right"
              isTrailingIcon={true}
            >
              {label}
            </OakTertiaryButton>
          );
        })}
      </OakFlex>
    </OakFlex>
  );
}
