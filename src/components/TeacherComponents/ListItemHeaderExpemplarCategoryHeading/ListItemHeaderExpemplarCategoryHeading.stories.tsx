import { StoryFn, Meta } from "@storybook/nextjs";

import Component from ".";

export default {
  component: Component,
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = () => (
  <Component
    keyStageTitle="keyStageTitle"
    yearTitle={"yearTitle"}
    subjectTitle={"subjectTitle"}
  />
);

export const ListItemHeaderExpemplarCategoryHeading = {
  render: Template,
};
