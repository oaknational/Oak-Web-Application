"use client";
import {
  OakBox,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakMaxWidth,
} from "@oaknational/oak-components";

import {
  Header,
  SubjectIcon,
} from "@/components/TeacherComponents/Header/Header";
import CardListing, {
  CardListingTags,
} from "@/components/TeacherComponents/CardListing/CardListing";

export type CanonicalLessonHubProps = {
  subjectSlug: string;
  lessonName: string;
  listingTitle?: string;
  programmesForLesson: Array<{
    subject: string;
    unitTitle: string;
    examboard?: string | null;
    tier?: string | null;
    year?: string | null;
    pathway?: string | null;
    href: string;
  }>;
};

export const CanonicalLessonHub = ({
  subjectSlug,
  lessonName,
  listingTitle = "Lesson appears in",
  programmesForLesson,
}: CanonicalLessonHubProps) => {
  return (
    <OakFlex $flexDirection="column" $gap={"spacing-64"}>
      <Header
        layoutVariant="compact"
        subjectIcon={`subject-${subjectSlug}` as SubjectIcon}
        heading={lessonName}
        backgroundColorLevel={1}
      />
      <OakMaxWidth>
        <OakBox
          $pa="spacing-20"
          $btr="border-radius-l"
          $background={"bg-neutral"}
          $mr="spacing-16"
          $maxWidth="fit-content"
        >
          <OakHeading
            tag="h2"
            $font="heading-5"
            $overflow="hidden"
            $textOverflow="ellipsis"
            $whiteSpace="nowrap"
            data-testid="year-heading"
          >
            {listingTitle}
          </OakHeading>
        </OakBox>
        <OakGrid
          as="ol"
          $cg={"spacing-16"}
          $rg={"spacing-16"}
          $mv={"spacing-0"}
          $background={"bg-neutral"}
          $pa={"spacing-20"}
          $position={"relative"}
          $mb={"spacing-48"}
          $bbr="border-radius-l"
          $btrr="border-radius-l"
        >
          {programmesForLesson.map((programme) => (
            <OakGridArea
              $colSpan={[12, 4]}
              $minHeight="spacing-180"
              as="li"
              key={programme.href}
            >
              <CardListing
                index={programme.subject}
                title={programme.unitTitle}
                href={programme.href}
                subcopy={programme.year}
                layoutVariant="vertical"
                tags={getTagsForCard({
                  examboard: programme.examboard,
                  tier: programme.tier,
                  pathway: programme.pathway,
                })}
                headingTag="h3"
              />
            </OakGridArea>
          ))}
        </OakGrid>
      </OakMaxWidth>
    </OakFlex>
  );
};

const getTagsForCard = ({
  examboard,
  tier,
  pathway,
}: {
  examboard?: string | null;
  tier?: string | null;
  pathway?: string | null;
}): CardListingTags => {
  const tags = [];
  if (examboard) {
    tags.push({ label: examboard });
  }
  if (tier) {
    tags.push({ label: tier });
  }
  if (pathway) {
    tags.push({ label: pathway });
  }
  return tags;
};
