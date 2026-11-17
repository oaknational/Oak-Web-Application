import type { Meta, StoryObj } from "@storybook/nextjs";

import { hubData } from "../../__fixtures__/stories";

import { NationalCurriculumInsightsSubjectLinks } from "./SubjectLinks";

const meta = {
  component: NationalCurriculumInsightsSubjectLinks,
  parameters: { layout: "fullscreen" },
  args: {
    data: hubData,
    section: {
      __typename: "NationalCurriculumInsightsSubjectLinksSection",
      heading: "Explore subject-by-subject curriculum changes",
      links: hubData.subjects.map(({ title, slug }) => ({
        title,
        subjectSlug: slug,
        iconName: `subject-${slug}`,
      })),
    },
  },
} satisfies Meta<typeof NationalCurriculumInsightsSubjectLinks>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
