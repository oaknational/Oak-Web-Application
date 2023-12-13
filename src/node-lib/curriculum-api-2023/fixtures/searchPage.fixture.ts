import { SearchPageData } from "..";

import { SearchResultsItemProps } from "@/components/SearchResultsItem/SearchResultsItem";

const searchPageFixture = (
  partial?: Partial<SearchPageData>,
): SearchPageData[] => [
  {
    keyStages: [
      {
        shortCode: "KS1",
        slug: "ks1",
        title: "Key stage 1",
        displayOrder: 1,
      },
      {
        shortCode: "KS2",
        slug: "ks2",
        title: "Key stage 2",
        displayOrder: 2,
      },
      {
        shortCode: "KS3",
        slug: "ks3",
        title: "Key stage 3",
        displayOrder: 3,
      },
      {
        shortCode: "KS4",
        slug: "ks4",
        title: "Key stage 4",
        displayOrder: 4,
      },
    ],
    subjects: [
      { slug: "computing", title: "Computing", displayOrder: 1 },
      { slug: "english", title: "English", displayOrder: 2 },
      { slug: "maths", title: "Maths", displayOrder: 3 },
      { slug: "science", title: "science", displayOrder: 4 },
    ],
    contentTypes: [
      { slug: "unit", title: "Units" },
      { slug: "lesson", title: "Lessons" },
    ],
    ...partial,
  },
];
export default searchPageFixture;

export const onClickSearchHit = jest.fn();

export const searchResultsItem = (
  partial?: Partial<SearchResultsItemProps[]>,
): SearchResultsItemProps[] => [
  {
    type: "lesson",
    title: "The FDE cycle",
    description:
      "In this lesson, we will extend our knowledge of the components that make up the <b>CPU</b> by introducing the fetch-decode-execute cycle (FDE). We will observe a program running and will connect the parts of the <b>CPU</b> to their role in executing instructions.",
    subjectSlug: "computing",
    keyStageShortCode: "KS4",
    keyStageTitle: "Key stage 4",
    keyStageSlug: "ks4",
    subjectTitle: "Computing",
    onClick: onClickSearchHit,
    buttonLinkProps: {
      page: "lesson-overview",
      lessonSlug: "the-fde-cycle-68w3ct",
      programmeSlug: "computing-secondary-ks4-l",
      unitSlug: "computer-systems-e17a",
    },
    legacy: true,
    pathways: [
      {
        programmeSlug: "maths-program-1",
        unitSlug: "algebra-unit",
        unitTitle: "Algebra",
        keyStageSlug: "ks3",
        keyStageTitle: "Key Stage 3",
        subjectSlug: "maths",
        subjectTitle: "Mathematics",
        tierSlug: "higher",
        tierTitle: "Higher",
        examBoardSlug: "exam-board-1",
        examBoardTitle: "Exam Board 1",
        yearSlug: "2023",
        yearTitle: "2023-2024",
      },
      {
        programmeSlug: "maths-program-2",
        unitSlug: "biology-unit",
        unitTitle: "Biology",
        keyStageSlug: "ks4",
        keyStageTitle: "Key Stage 4",
        subjectSlug: "science",
        subjectTitle: "Science",
        tierSlug: null,
        tierTitle: null,
        examBoardSlug: null,
        examBoardTitle: null,
        yearSlug: null,
        yearTitle: null,
      },
      {
        programmeSlug: "maths-program-3",
        unitSlug: "world-wars-unit",
        unitTitle: "World Wars",
        keyStageSlug: "ks2",
        keyStageTitle: "Key Stage 2",
        subjectSlug: "history",
        subjectTitle: "History",
        tierSlug: "foundation",
        tierTitle: "Foundation",
        examBoardSlug: "exam-board-2",
        examBoardTitle: "Exam Board 2",
        yearSlug: "2022",
        yearTitle: "2022-2023",
      },
    ],
    firstItemRef: null,
  },
  {
    type: "unit",
    title: "Computing systems",
    nullTitle: "Computing systems",
    subjectSlug: "computing",
    subjectTitle: "Computing",
    keyStageShortCode: "KS3",
    keyStageTitle: "Key stage 3",
    keyStageSlug: "ks3",
    onClick: onClickSearchHit,
    buttonLinkProps: {
      page: "lesson-index",
      programmeSlug: "computing-secondary-ks3-l",
      unitSlug: "computing-systems-1558",
    },
    legacy: true,
    pathways: [
      {
        programmeSlug: "maths-program-1",
        unitSlug: "algebra-unit",
        unitTitle: "Algebra",
        keyStageSlug: "ks3",
        keyStageTitle: "Key Stage 3",
        subjectSlug: "maths",
        subjectTitle: "Mathematics",
        tierSlug: "higher",
        tierTitle: "Higher",
        examBoardSlug: "exam-board-1",
        examBoardTitle: "Exam Board 1",
        yearSlug: "2023",
        yearTitle: "2023-2024",
      },
      {
        programmeSlug: "maths-program-2",
        unitSlug: "biology-unit",
        unitTitle: "Biology",
        keyStageSlug: "ks4",
        keyStageTitle: "Key Stage 4",
        subjectSlug: "science",
        subjectTitle: "Science",
        tierSlug: null,
        tierTitle: null,
        examBoardSlug: null,
        examBoardTitle: null,
        yearSlug: null,
        yearTitle: null,
      },
      {
        programmeSlug: "maths-program-3",
        unitSlug: "world-wars-unit",
        unitTitle: "World Wars",
        keyStageSlug: "ks2",
        keyStageTitle: "Key Stage 2",
        subjectSlug: "history",
        subjectTitle: "History",
        tierSlug: "foundation",
        tierTitle: "Foundation",
        examBoardSlug: "exam-board-2",
        examBoardTitle: "Exam Board 2",
        yearSlug: "2022",
        yearTitle: "2022-2023",
      },
    ],
    firstItemRef: {
      current: null,
    },
    ...partial,
  },
];
