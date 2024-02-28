import {
  OakHeading,
  OakHeadingTag,
  OakSpan,
  OakFlex,
} from "@oaknational/oak-components";

import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import { TagFunctional } from "@/components/SharedComponents/TagFunctional";
import { TagColor } from "@/components/SharedComponents/TagFunctional/TagFunctional";

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
  props: LessonAppearsInPathwayCardProps,
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
      $background="white"
      $borderRadius="border-radius-s"
    >
      <OakHeading tag={headingTag}>
        <OakFlex $flexDirection={["row"]} $pa="inner-padding-m">
          {examBoardTitle && (
            <TagFunctional
              text={examBoardTitle}
              color={examBoardTagColor}
              $mr="space-between-ssx"
            />
          )}
          <OakSpan $font="heading-5">{subjectTitle}</OakSpan>
        </OakFlex>
      </OakHeading>
      <OakFlex $flexDirection={["row"]} $pa="inner-padding-m" $flexWrap="wrap">
        {tiers.map(({ tierTitle, programmeSlug }, i) => {
          const label = tierTitle ? `Show ${tierTitle} unit` : "Show unit";
          return (
            <ButtonAsLink
              key={`tier-${programmeSlug}-${unitSlug}`}
              variant="minimal"
              size="small"
              label={label}
              page="lesson-index"
              programmeSlug={programmeSlug}
              unitSlug={unitSlug}
              icon="chevron-right"
              $iconPosition="trailing"
              $mr={i === tiers.length ? 0 : 24}
              $hoverStyles={["underline-link-text"]}
            />
          );
        })}
      </OakFlex>
    </OakFlex>
  );
}
