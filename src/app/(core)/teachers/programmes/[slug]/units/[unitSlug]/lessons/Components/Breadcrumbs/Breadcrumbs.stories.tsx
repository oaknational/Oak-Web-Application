import type { Meta, StoryObj } from "@storybook/nextjs";

import { Breadcrumbs } from "./Breadcrumbs";

import teachersLessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersLessonOverview.fixture";
import teachersUnitOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersUnitOverview.fixture";
import { getTeacherSubjectPhaseSlug } from "@/utils/curriculum/slugs";

const lessonData = teachersLessonOverviewFixture({
  examBoardSlug: "aqa",
  examBoardTitle: "AQA",
  tierSlug: "foundation",
  tierTitle: "Foundation",
});

const lessonSubjectPhaseSlug = getTeacherSubjectPhaseSlug({
  subjectSlug: lessonData.subjectSlug,
  phaseSlug: lessonData.phaseSlug,
  examboardSlug: lessonData.examBoardSlug,
  subjectParentTitle: lessonData.subjectParent,
});

const unitData = teachersUnitOverviewFixture();
const unitSubjectPhaseSlug = getTeacherSubjectPhaseSlug({
  subjectSlug: unitData.subjectSlug,
  phaseSlug: unitData.phaseSlug,
  examboardSlug: unitData.examBoardSlug,
  subjectParentTitle: unitData.parentSubject,
});

const meta: Meta<typeof Breadcrumbs> = {
  title: "App/Programmes/Units/Lessons/Breadcrumbs",
  component: Breadcrumbs,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Breadcrumbs>;

export const Lesson: Story = {
  args: {
    subjectPhaseSlug: lessonSubjectPhaseSlug,
    mode: "lesson",
  },
};

export const Unit: Story = {
  args: {
    data: unitData,
    subjectPhaseSlug: unitSubjectPhaseSlug,
    mode: "unit",
  },
};

export const Downloads: Story = {
  args: {
    subjectPhaseSlug: "biology-secondary-aqa",
    mode: "downloads",
  },
};
