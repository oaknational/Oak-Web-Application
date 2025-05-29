import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/react";

import {
  mockPortableTextBlocks,
  mockSubject,
} from "./CurricSEOAccordion.fixtures";

import Component from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const CurricSEOAccordion: Story = {
  args: {
    curriculumSeoText: mockPortableTextBlocks,
    subject: mockSubject,
  },
  render: function Render(args) {
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Component {...args} />
      </OakThemeProvider>
    );
  },
};
