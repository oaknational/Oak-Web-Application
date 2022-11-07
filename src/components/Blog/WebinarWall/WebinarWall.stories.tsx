import { ComponentStory, ComponentMeta } from "@storybook/react";

import Box from "../../Box";
import AspectRatio from "../../AspectRatio";

import Component from ".";

export default {
  title: "Blogs & Webinars/WebinarWall",
  component: Component,
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
  decorators: [
    (Story) => (
      <Box $position="relative" $maxWidth={720} $ma="auto">
        <AspectRatio ratio={"16:9"}>
          <Story />
        </AspectRatio>
      </Box>
    ),
  ],
  argTypes: {
    argTypes: { buttonOnClick: { action: "clicked" } },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const WebinarWall = Template.bind({});
WebinarWall.args = {
  headingTag: "h3",
  headingText: "Register to view",
  text: "You will only need to register once and you’ll be good to go.",
  buttonHref: "https://example.com",
  buttonText: "Register",
};
