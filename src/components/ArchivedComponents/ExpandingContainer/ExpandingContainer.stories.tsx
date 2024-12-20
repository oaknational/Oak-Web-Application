import type { Meta, StoryObj } from "@storybook/react";

import Component from ".";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import Card from "@/components/SharedComponents/Card";

const meta: Meta<typeof Component> = {
  component: Component,
  decorators: [AnalyticsDecorator, (Story) => <Story />],
  argTypes: {
    children: {
      defaultValue: (
        <Card $background={"white"} $ba={3} $borderColor={"grey30"}>
          Grid box
        </Card>
      ),
    },
    title: { defaultValue: "Video" },
    // external:{defaultValue, true},
    // projetable:{defaultValue, true},
    // downloadable:{defaultValue, true},
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

export const ExpandingContainer: Story = {
  args: {
    external: true,
    projectable: true,
    downloadable: true,
    title: "Lesson video",
    programmeSlug: "secondary-ks3-maths",
    unitSlug: "unit",
    lessonSlug: "slug-slug-slug",
  },
  render: (args) => <Component {...args} />,
};
