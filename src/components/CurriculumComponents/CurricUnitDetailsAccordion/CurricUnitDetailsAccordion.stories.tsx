import { Meta, StoryObj } from "@storybook/react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import Component from "./CurricUnitDetailsAccordion";

const meta: Meta<typeof Component> = {
  component: Component,
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
  argTypes: {
    title: {
      defaultValue: "Lesson in unit",
    },
    lastAccordion: {
      defaultValue: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

export const CurriculumUnitDetailsAccordion: Story = {
  args: {
    title: "Lessons in unit",
  },
  render: (args) => (
    <Component {...args}>
      <p>test child content</p>
    </Component>
  ),
};
