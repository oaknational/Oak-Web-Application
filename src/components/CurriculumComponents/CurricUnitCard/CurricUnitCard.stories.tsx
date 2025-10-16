import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/nextjs";

import { CurricLessonWarning } from "../CurricLessonWarning";

import Component from "./CurricUnitCard";
import { unitWithOptions, unitWithoutOptions } from "./CurricUnitCard.fixtures";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const CurricUnitCard: Story = {
  args: {
    unit: unitWithOptions,
    index: 10,
    isHighlighted: false,
    href: "#",
  },
  render: function Render(args) {
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Component {...args} />
      </OakThemeProvider>
    );
  },
};

export const CurricUnitCardHighlighted: Story = {
  args: {
    unit: unitWithOptions,
    index: 10,
    isHighlighted: true,
    href: "#",
  },
  render: function Render(args) {
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Component {...args} />
      </OakThemeProvider>
    );
  },
};

export const CurricUnitCardAdditionalSlot: Story = {
  args: {
    unit: unitWithoutOptions,
    index: 10,
    href: "#",
  },
  render: function Render(args) {
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Component
          {...args}
          additional={<CurricLessonWarning count={8} total={10} />}
        />
      </OakThemeProvider>
    );
  },
};
