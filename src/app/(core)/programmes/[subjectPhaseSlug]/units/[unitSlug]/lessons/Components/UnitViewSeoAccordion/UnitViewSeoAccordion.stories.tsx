import type { Meta, StoryObj } from "@storybook/react";

import { UnitViewSeoAccordion } from "./UnitViewSeoAccordion";

const meta: Meta<typeof UnitViewSeoAccordion> = {
  component: UnitViewSeoAccordion,
  tags: ["autodocs"],
  title: "Unit Page / UnitViewSeoAccordion",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Secondary: Story = {
  args: {
    examBoardTitle: "AQA",
    yearGroupTitle: "Year 10",
    keyStage: "KS4",
    unitTitle: "Coordination and control",
    subjectTitle: "Biology",
    phaseSlug: "secondary",
    subjectPhaseSlug: "biology-secondary-aqa",
  },
};

export const SecondaryEdexcel: Story = {
  args: {
    examBoardTitle: "Edexcel",
    yearGroupTitle: "Year 7",
    keyStage: "KS3",
    unitTitle: "Cells",
    subjectTitle: "Biology",
    phaseSlug: "secondary",
    subjectPhaseSlug: "biology-secondary-edexcel",
  },
};

export const Primary: Story = {
  args: {
    examBoardTitle: undefined,
    yearGroupTitle: "Year 4",
    keyStage: "KS2",
    unitTitle: "Animals including humans",
    subjectTitle: "Science",
    phaseSlug: "primary",
    subjectPhaseSlug: "science-primary",
  },
};

export const PrimaryKS1: Story = {
  args: {
    examBoardTitle: undefined,
    yearGroupTitle: "Year 2",
    keyStage: "KS1",
    unitTitle: "Understanding animals",
    subjectTitle: "Science",
    phaseSlug: "primary",
    subjectPhaseSlug: "science-primary",
  },
};

export const NoExamBoard: Story = {
  args: {
    examBoardTitle: undefined,
    yearGroupTitle: "Year 11",
    keyStage: "KS4",
    unitTitle: "Energy",
    subjectTitle: "Physics",
    phaseSlug: "secondary",
    subjectPhaseSlug: "physics-secondary",
  },
};
