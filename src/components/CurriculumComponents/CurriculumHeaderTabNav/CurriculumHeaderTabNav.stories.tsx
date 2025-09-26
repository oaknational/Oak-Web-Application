import type { Meta, StoryObj } from "@storybook/nextjs";

import CurriculumHeaderTabNav from "./index";

import { ButtonAsLinkProps } from "@/components/SharedComponents/Button/ButtonAsLink";

const mockLinks: ButtonAsLinkProps[] = [
  {
    label: "Unit sequence",
    page: "curriculum-units",
    subjectPhaseSlug: "maths-secondary",
    isCurrent: false,
    currentStyles: ["underline"],
    scroll: false,
  },
  {
    label: "Overview",
    page: "curriculum-overview",
    subjectPhaseSlug: "maths-secondary",
    isCurrent: true,
    currentStyles: ["underline"],
    scroll: false,
  },
  {
    label: "Download",
    page: "curriculum-downloads",
    subjectPhaseSlug: "maths-secondary",
    isCurrent: false,
    currentStyles: ["underline"],
    scroll: false,
  },
];

const meta: Meta<typeof CurriculumHeaderTabNav> = {
  title: "Components/Curriculum/CurriculumHeaderTabNav",
  component: CurriculumHeaderTabNav,
  argTypes: {
    variant: {
      control: {
        type: "select",
        options: ["flat", "brush", "minimal", "buttonStyledAsLink"],
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof CurriculumHeaderTabNav>;

export const Default: Story = {
  args: {
    label: "Curriculum Navigation",
    links: mockLinks,
    variant: "flat",
  },
};

export const AllTabsInactive: Story = {
  args: {
    ...Default.args,
    links: mockLinks.map((link) => ({ ...link, isCurrent: false })),
  },
};
