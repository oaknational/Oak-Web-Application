import { ComponentStory, ComponentMeta } from "@storybook/react";

import CurriculumHeaderTabNav from "./index";

import { ButtonAsLinkProps } from "@/components/SharedComponents/Button/ButtonAsLink";

export default {
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
} as ComponentMeta<typeof CurriculumHeaderTabNav>;

const Template: ComponentStory<typeof CurriculumHeaderTabNav> = (args) => (
  <CurriculumHeaderTabNav {...args} />
);

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

export const Default = Template.bind({});
Default.args = {
  label: "Curriculum Navigation",
  links: mockLinks,
  variant: "flat",
};

export const AllTabsInactive = Template.bind({});
AllTabsInactive.args = {
  ...Default.args,
  links: mockLinks.map((link) => ({ ...link, isCurrent: false })),
};
