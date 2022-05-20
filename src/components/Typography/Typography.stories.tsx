import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Text from "./Typography";

export default {
  title: "Foundations/Typography",
  component: Text,
  argTypes: {
    semanticVariant: {
      options: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "body1",
        "body2",
        "body3",
        "body4",
      ],
      control: { type: "radio" },
    },
  },
} as ComponentMeta<typeof Text>;

const Template: ComponentStory<typeof Text> = (args) => (
  <div>
    <Text {...args}>{args.semanticVariant}</Text>
  </div>
);

export const TypographyExample = Template.bind({});

TypographyExample.args = {
  semanticVariant: "h2",
};
