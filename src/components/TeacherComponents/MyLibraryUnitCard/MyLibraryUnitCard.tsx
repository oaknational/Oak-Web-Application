import {
  OakFlex,
  OakHeading,
  OakSmallTertiaryInvertedButton,
  OakP,
  OakSpan,
} from "@oaknational/oak-components";

import { LessonListSchema } from "@/node-lib/curriculum-api-2023/shared.schema";

type MyLibraryUnitCardProps = {
  index: number;
  unitTitle: string;
  yearTitle: string;
  saveTime: string;
  href: string;
  lessons: LessonListSchema;
  onSave?: () => void;
  isSaved?: boolean;
};

// const curriculumData = {
//   unitTitle: "Non-fiction: crime and punishment",
//   yearTitle: "Year 10",
//   lessons: [
//     {
//       lessonSlug: "reading-complex-texts-about-crime-and-punishment",
//       lessonTitle:
//         "Reading and comparing two texts about prisons: London (1862) and Norway (2013)",
//       description:
//         "I can read two texts about the same topic - prisons - and begin to compare them.",
//       pupilLessonOutcome:
//         "I can read two texts about the same topic - prisons - and begin to compare them.",
//       expired: false,
//       quizCount: 2,
//       videoCount: 1,
//       presentationCount: 1,
//       worksheetCount: 1,
//       hasCopyrightMaterial: false,
//       orderInUnit: 1,
//       lessonCohort: "2023-2024",
//       actions: [Object],
//       isUnpublished: false,
//       lessonReleaseDate: "2025-03-27T10:45:01.310604+00:00",
//     },
//     {
//       lessonSlug: "writing-excellent-summaries",
//       lessonTitle:
//         "Developing a summary of a non-fiction text by including inferences",
//       description:
//         "I can identify examples of inference in a summary about a non-fiction text, and use this understanding to create my own developed summary.",
//       pupilLessonOutcome:
//         "I can identify examples of inference in a summary about a non-fiction text, and use this understanding to create my own developed summary.",
//       expired: false,
//       quizCount: 2,
//       videoCount: 1,
//       presentationCount: 1,
//       worksheetCount: 1,
//       hasCopyrightMaterial: false,
//       orderInUnit: 2,
//       lessonCohort: "2023-2024",
//       actions: [Object],
//       isUnpublished: false,
//       lessonReleaseDate: "2025-03-27T10:45:01.310604+00:00",
//     },
//     {
//       lessonSlug: "planning-a-well-structured-response",
//       lessonTitle:
//         "Using credible statistics in a piece of non-fiction writing",
//       description:
//         "I can understand what makes a credible statistic, and use this understanding to create my own credible statistics.",
//       pupilLessonOutcome:
//         "I can understand what makes a credible statistic, and use this understanding to create my own credible statistics.",
//       expired: false,
//       quizCount: 2,
//       videoCount: 1,
//       presentationCount: 1,
//       worksheetCount: 1,
//       hasCopyrightMaterial: false,
//       orderInUnit: 3,
//       lessonCohort: "2023-2024",
//       actions: [Object],
//       isUnpublished: false,
//       lessonReleaseDate: "2025-03-27T10:45:01.310604+00:00",
//     },
//     {
//       lessonSlug: "diving-deeper-with-language-analysis",
//       lessonTitle:
//         "Summarising a non-fiction text: 'a letter to my son' (the Guardian, 2014)",
//       description:
//         "I can show understanding of a non-fiction text by summarising it, as well as exploring the writer’s use of direct address.",
//       pupilLessonOutcome:
//         "I can show understanding of a non-fiction text by summarising it, as well as exploring the writer’s use of direct address.",
//       expired: false,
//       quizCount: 2,
//       videoCount: 1,
//       presentationCount: 1,
//       worksheetCount: 1,
//       hasCopyrightMaterial: false,
//       orderInUnit: 4,
//       lessonCohort: "2023-2024",
//       actions: [Object],
//       isUnpublished: false,
//       lessonReleaseDate: "2025-03-27T10:45:01.310604+00:00",
//     },
//     {
//       lessonSlug: "comparing-writers-attitudes-and-perspectives",
//       lessonTitle:
//         "Comparing texts about drug misuse: ‘Confessions’ (1821) and ‘A letter to’ (2014)",
//       description:
//         "I can read two texts about the same topic - drug misuse - and begin to compare the perspectives of the writers who wrote them.",
//       pupilLessonOutcome:
//         "I can read two texts about the same topic - drug misuse - and begin to compare the perspectives of the writers who wrote them.",
//       expired: false,
//       quizCount: 2,
//       videoCount: 1,
//       presentationCount: 1,
//       worksheetCount: 1,
//       hasCopyrightMaterial: false,
//       orderInUnit: 5,
//       lessonCohort: "2023-2024",
//       actions: [Object],
//       isUnpublished: false,
//       lessonReleaseDate: "2025-03-27T10:45:01.310604+00:00",
//     },
//     {
//       lessonSlug: "planning-and-writing-comparative-responses",
//       lessonTitle: "Using figurative language in non-fiction writing",
//       description:
//         "I can show understanding of figurative language by exploring its effects and using it in my own writing.",
//       pupilLessonOutcome:
//         "I can show understanding of figurative language by exploring its effects and using it in my own writing.",
//       expired: false,
//       quizCount: 2,
//       videoCount: 1,
//       presentationCount: 1,
//       worksheetCount: 1,
//       hasCopyrightMaterial: false,
//       orderInUnit: 6,
//       lessonCohort: "2023-2024",
//       actions: [Object],
//       isUnpublished: false,
//       lessonReleaseDate: "2025-03-27T10:45:01.310604+00:00",
//     },
//     {
//       lessonSlug: "writing-in-appropriate-style-tone-and-register",
//       lessonTitle: "Planning an open letter using single paragraph outlines",
//       description:
//         "I can plan a letter using single paragraph outlines with a focus on using credible statistics, direct address and figurative language.",
//       pupilLessonOutcome:
//         "I can plan a letter using single paragraph outlines with a focus on using credible statistics, direct address and figurative language.",
//       expired: false,
//       quizCount: 2,
//       videoCount: 1,
//       presentationCount: 1,
//       worksheetCount: 1,
//       hasCopyrightMaterial: false,
//       orderInUnit: 7,
//       lessonCohort: "2023-2024",
//       actions: [Object],
//       isUnpublished: false,
//       lessonReleaseDate: "2025-03-27T10:45:01.310604+00:00",
//     },
//     {
//       lessonSlug: "expressing-a-strong-viewpoint",
//       lessonTitle:
//         "Reading an opinion article and creating rhetorical questions",
//       description:
//         "I can articulate a personal response to an opinion article. I can understand what makes an effective rhetorical question and use this understanding to create my own.",
//       pupilLessonOutcome:
//         "I can articulate a personal response to an opinion article. I can understand what makes an effective rhetorical question and use this understanding to create my own.",
//       expired: false,
//       quizCount: 2,
//       videoCount: 1,
//       presentationCount: 1,
//       worksheetCount: 1,
//       hasCopyrightMaterial: false,
//       orderInUnit: 8,
//       lessonCohort: "2023-2024",
//       actions: [Object],
//       isUnpublished: false,
//       lessonReleaseDate: "2025-03-27T10:45:01.310604+00:00",
//     },
//     {
//       lessonSlug: "developing-a-strong-viewpoint",
//       lessonTitle: "Using structural features effectively in non-fiction texts",
//       description:
//         "I can understand how a writer uses structural features for effect and use this understanding to consider my own use of structure in my writing.",
//       pupilLessonOutcome:
//         "I can understand how a writer uses structural features for effect and use this understanding to consider my own use of structure in my writing.",
//       expired: false,
//       quizCount: 2,
//       videoCount: 1,
//       presentationCount: 1,
//       worksheetCount: 1,
//       hasCopyrightMaterial: false,
//       orderInUnit: 9,
//       lessonCohort: "2023-2024",
//       actions: [Object],
//       isUnpublished: false,
//       lessonReleaseDate: "2025-03-27T10:45:01.310604+00:00",
//     },
//     {
//       lessonSlug: "using-the-conventions-of-leaflets-creatively",
//       lessonTitle: "Using the conventions of website content creatively",
//       description:
//         "I can identify the conventions a website and use them creatively in my own writing.",
//       pupilLessonOutcome:
//         "I can identify the conventions a website and use them creatively in my own writing.",
//       expired: false,
//       quizCount: 2,
//       videoCount: 1,
//       presentationCount: 1,
//       worksheetCount: 1,
//       hasCopyrightMaterial: false,
//       orderInUnit: 10,
//       lessonCohort: "2023-2024",
//       actions: [Object],
//       isUnpublished: false,
//       lessonReleaseDate: "2025-03-27T10:45:01.310604+00:00",
//     },
//     {
//       lessonSlug: "planning-and-writing-a-leaflet",
//       lessonTitle: "Planning and writing website content",
//       description: "I can successfully plan and write copy for a website.",
//       pupilLessonOutcome:
//         "I can successfully plan and write copy for a website.",
//       expired: false,
//       quizCount: 2,
//       videoCount: 1,
//       presentationCount: 1,
//       worksheetCount: 1,
//       hasCopyrightMaterial: false,
//       orderInUnit: 11,
//       lessonCohort: "2023-2024",
//       actions: [Object],
//       isUnpublished: false,
//       lessonReleaseDate: "2025-03-27T10:45:01.310604+00:00",
//     },
//     {
//       lessonSlug: "revising-and-editing-your-leaflet",
//       lessonTitle: "Revising and editing non-fiction writing",
//       description:
//         "I can use effective editing strategies to revise and rewrite a response.",
//       pupilLessonOutcome:
//         "I can use effective editing strategies to revise and rewrite a response.",
//       expired: false,
//       quizCount: 2,
//       videoCount: 1,
//       presentationCount: 1,
//       worksheetCount: 1,
//       hasCopyrightMaterial: false,
//       orderInUnit: 12,
//       lessonCohort: "2023-2024",
//       actions: [Object],
//       isUnpublished: false,
//       lessonReleaseDate: "2025-03-27T10:45:01.310604+00:00",
//     },
//   ],
//   saveTime: "2023-10-01T12:00:00Z",
//   href: "/teachers/programmes/english-secondary-ks4-aqa/units/non-fiction-crime-and-punishment/lessons",
// };

// /teachers/programmes/english-secondary-ks4-aqa/units/non-fiction-crime-and-punishment/lessons/reading-complex-texts-about-crime-and-punishment
// /teachers/programmes/english-secondary-ks4-aqa/units/non-fiction-crime-and-punishment/lessons/writing-excellent-summaries
// /teachers/programmes/english-secondary-ks4-aqa/units/non-fiction-crime-and-punishment/lessons/planning-a-well-structured-response
// /teachers/programmes/english-secondary-ks4-aqa/units/non-fiction-crime-and-punishment/lessons/diving-deeper-with-language-analysis
// /teachers/programmes/english-secondary-ks4-aqa/units/non-fiction-crime-and-punishment/lessons/comparing-writers-attitudes-and-perspectives
// /teachers/programmes/english-secondary-ks4-aqa/units/non-fiction-crime-and-punishment/lessons/planning-and-writing-comparative-responses
// /teachers/programmes/english-secondary-ks4-aqa/units/non-fiction-crime-and-punishment/lessons/writing-in-appropriate-style-tone-and-register
// /teachers/programmes/english-secondary-ks4-aqa/units/non-fiction-crime-and-punishment/lessons/expressing-a-strong-viewpoint
// /teachers/programmes/english-secondary-ks4-aqa/units/non-fiction-crime-and-punishment/lessons/developing-a-strong-viewpoint
// /teachers/programmes/english-secondary-ks4-aqa/units/non-fiction-crime-and-punishment/lessons/using-the-conventions-of-leaflets-creatively
// /teachers/programmes/english-secondary-ks4-aqa/units/non-fiction-crime-and-punishment/lessons/planning-and-writing-a-leaflet
// /teachers/programmes/english-secondary-ks4-aqa/units/non-fiction-crime-and-punishment/lessons/revising-and-editing-your-leaflet

const UnitCardIndex = ({ index }: Pick<MyLibraryUnitCardProps, "index">) => (
  <OakFlex
    $pa={"inner-padding-l"}
    $background={"bg-decorative1-main"}
    $flexDirection={"column"}
    $justifyContent={"center"}
    $alignItems={"center"}
    $width={"all-spacing-11"}
    $height={"all-spacing-11"}
    $borderRadius={"border-radius-m"}
  >
    <OakHeading tag="div" $font={"heading-5"}>
      {index}
    </OakHeading>
  </OakFlex>
);

const UnitCardHeader = ({
  unitTitle,
  yearTitle,
  saveTime,
  onSave,
  isSaved,
}: Pick<
  MyLibraryUnitCardProps,
  "unitTitle" | "yearTitle" | "saveTime" | "onSave" | "isSaved"
>) => (
  <OakFlex $alignItems={"start"} $gap={"space-between-xs"}>
    <OakFlex $flexGrow={1} $flexDirection={"column"} $gap={"space-between-ssx"}>
      <OakHeading tag="h3" $font={"heading-5"}>
        {unitTitle}
      </OakHeading>
      <OakP>
        {yearTitle}
        <OakSpan $ph={"inner-padding-xs"}>•</OakSpan>
        Saved at{" "}
        {new Date(saveTime).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          hour: "numeric",
          minute: "2-digit",
        })}
      </OakP>
    </OakFlex>
    <OakSmallTertiaryInvertedButton
      iconName={isSaved ? "bookmark-filled" : "bookmark-outlined"}
      isTrailingIcon
      onClick={onSave}
      aria-label={`${isSaved ? "Unsave" : "Save"} this unit: ${unitTitle} `}
    >
      {isSaved ? "Saved" : "Save"}
    </OakSmallTertiaryInvertedButton>
  </OakFlex>
);

const UnitCardContent = ({
  lessonCountHeader,
  lessons,
}: {
  lessonCountHeader: string;
  lessons: LessonListSchema;
}) => (
  <OakFlex $flexDirection={"column"} $gap={"all-spacing-6"}>
    <OakP>{lessonCountHeader}</OakP>
    <OakFlex
      $flexDirection={"column"}
      $gap={"space-between-xs"}
      $borderColor={"border-decorative1-stronger"}
      $bl={"border-solid-s"}
      $pl={"inner-padding-xl"}
    >
      {lessons.map((lesson, i) => (
        <OakHeading tag="h4" $font={"heading-light-7"}>
          {i + 1}. {lesson.lessonTitle}
        </OakHeading>
      ))}
    </OakFlex>
  </OakFlex>
);

export default function MyLibraryUnitCard(props: MyLibraryUnitCardProps) {
  const { index, unitTitle, yearTitle, saveTime, lessons, onSave, isSaved } =
    props;

  const unpublishedLessonCount = lessons.filter(
    (lesson) => lesson.isUnpublished,
  ).length;

  const lessonCountHeader = unpublishedLessonCount
    ? `${lessons.length - unpublishedLessonCount}/${lessons.length}`
    : `${lessons.length} lessons`;

  return (
    <OakFlex
      $flexDirection={"column"}
      $background={"bg-primary"}
      $borderRadius={"border-radius-m2"}
      $pa={"inner-padding-xl2"}
      $maxWidth={"all-spacing-23"}
    >
      <OakFlex $gap={"space-between-m"} $alignItems={"start"}>
        <UnitCardIndex index={index} />
        <OakFlex $flexGrow={1} $flexDirection={"column"} $gap={"all-spacing-5"}>
          <UnitCardHeader
            unitTitle={unitTitle}
            yearTitle={yearTitle}
            saveTime={saveTime}
            onSave={onSave}
            isSaved={isSaved}
          />
          <UnitCardContent
            lessonCountHeader={lessonCountHeader}
            lessons={lessons}
          />
        </OakFlex>
      </OakFlex>
    </OakFlex>
  );
}
