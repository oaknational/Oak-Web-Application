import { ComponentStory, ComponentMeta } from "@storybook/react";

import AnalyticsDecorator from "../../storybook-decorators/AnalyticsDecorator";
import Card from "../Card";

import Component from ".";

export default {
  title: "Foundations/ExpandingContainer",
  component: Component,
  decorators: [AnalyticsDecorator, (Story) => <Story />],
  argTypes: {
    children: {
      defaultValue: (
        <Card $background={"white"} $ba={3} $borderColor={"grey2"}>
          Grid box
        </Card>
      ),
    },
    title: { defaultValue: "Video" },
    // external:{defaultValue, true},
    // projetable:{defaultValue, true},
    // downloadable:{defaultValue, true},
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const ExpandingContainer = Template.bind({});

ExpandingContainer.args = {
  external: true,
  projectable: true,
  downloadable: true,
  title: "Video",
  programmeSlug: "secondary-ks3-maths",
  unitSlug: "unit",
  lessonSlug: "slug-slug-slug",
};
