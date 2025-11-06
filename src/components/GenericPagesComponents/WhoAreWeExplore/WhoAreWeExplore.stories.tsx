import { Meta, StoryObj } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { WhoAreWeExplore as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/GenericPagesComponents/WhoAreWeExplore",
  argTypes: {},
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    title: "Explore more about Oak",
    items: [
      {
        iconName: "curriculum-plan",
        title: "About Oak’s curriculum",
      },
      {
        iconName: "ai-worksheet",
        title: "Oak’s impact",
      },
      {
        iconName: "ai-worksheet",
        title: "Meet the team",
      },
      {
        iconName: "ai-worksheet",
        title: "Get involved",
      },
    ],
  },
  render: (args) => <Component {...args} />,
};
