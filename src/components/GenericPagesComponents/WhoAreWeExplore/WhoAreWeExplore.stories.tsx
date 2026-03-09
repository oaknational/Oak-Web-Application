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
        href: "#",
        componentType: "about_curriculum",
      },
      {
        iconName: "ai-worksheet",
        title: "Oak’s impact",
        href: "#",
        componentType: "oaks_impact",
      },
      {
        iconName: "ai-worksheet",
        title: "Meet the team",
        href: "#",
        componentType: "meet_the_team",
      },
      {
        iconName: "ai-worksheet",
        title: "Get involved",
        href: "#",
        componentType: "get_involved",
      },
      {
        iconName: "ai-worksheet",
        title: "Something else",
        href: "#",
        componentType: "about_oak",
      },
      {
        iconName: "ai-worksheet",
        title: "Yet another thing",
        href: "#",
        componentType: "about_oak",
      },
    ],
  },
  render: (args) => <Component {...args} />,
};
