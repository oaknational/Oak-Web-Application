import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/react";

import Component from "./CurricUnitsTabSidebar";

import { createUnit } from "@/fixtures/curriculum/unit";
import { createUnitOption } from "@/fixtures/curriculum/unitOption";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const CurricUnitsTabSidebar: Story = {
  args: {
    displayModal: true,
    onClose: () => {},
    programmeSlug: "test",
    unitData: createUnit({ slug: "test" }),
    unitOptionData: createUnitOption({ slug: "foo" }),
  },
  render: function Render(args) {
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Component {...args} />
      </OakThemeProvider>
    );
  },
};
