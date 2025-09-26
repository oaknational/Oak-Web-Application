import { StoryFn, Meta } from "@storybook/nextjs";
import { OakBox } from "@oaknational/oak-components";

import Component from ".";

import AspectRatio from "@/components/SharedComponents/AspectRatio";

export default {
  component: Component,
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
  decorators: [
    (Story) => (
      <OakBox $position="relative" $maxWidth="all-spacing-22" $ma="auto">
        <AspectRatio ratio={"16:9"}>
          <Story />
        </AspectRatio>
      </OakBox>
    ),
  ],
  argTypes: {
    argTypes: { buttonOnClick: { action: "clicked" } },
  },
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const UpcomingWebinarWall = {
  render: Template,

  args: {
    headingTag: "h3",
    headingText: "Register to view",
    buttonHref: "https://example.com",
    buttonText: "Register",
  },
};
