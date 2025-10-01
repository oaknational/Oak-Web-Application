import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/nextjs";
import { useArgs } from "storybook/preview-api";

import Component from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    onChange: {
      action: "onChange",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

export const YourDetails: Story = {
  args: {
    schools: [
      {
        name: "Acme School",
        urn: "TEST",
        la: "Acmeland",
        postcode: "CO9 9PE",
      },
    ],
    data: {
      schoolId: undefined,
      schoolName: undefined,
      schoolNotListed: undefined,
      email: undefined,
    },
    errors: {
      schoolId: undefined,
      email: undefined,
    },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Component {...args} onChange={updateArgs} />
      </OakThemeProvider>
    );
  },
};
