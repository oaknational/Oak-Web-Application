import ButtonAsLink from "@/components/Button/ButtonAsLink";
import Flex from "@/components/Flex";
import { TagFunctional } from "@/components/TagFunctional";
import { Heading, HeadingTag, Span } from "@/components/Typography";

type LessonPathwayCardProps = {
  headingTag: HeadingTag;
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
export function LessonPathwayCard(props: LessonPathwayCardProps) {
  const { headingTag, examBoardTitle, subjectTitle, unitSlug, tiers } = props;

  return (
    <Flex $flexDirection={["column"]} $background="white" $borderRadius={4}>
      <Heading tag={headingTag}>
        <Flex $flexDirection={["row"]} $pa={16}>
          {examBoardTitle && <TagFunctional text={examBoardTitle} $mr={10} />}
          <Span $font="heading-5">{subjectTitle}</Span>
        </Flex>
      </Heading>
      <Flex $flexDirection={["row"]} $pa={16} $flexWrap="wrap">
        {tiers.map(({ tierTitle, programmeSlug }, i) => {
          const label = tierTitle ? `Show ${tierTitle} unit` : "Show unit";
          return (
            <ButtonAsLink
              variant="minimal"
              size="small"
              label={label}
              page="lesson-index"
              programmeSlug={programmeSlug}
              unitSlug={unitSlug}
              icon="chevron-right"
              $iconPosition="trailing"
              $mr={i === tiers.length ? 0 : 24}
            />
          );
        })}
      </Flex>
    </Flex>
  );
}
