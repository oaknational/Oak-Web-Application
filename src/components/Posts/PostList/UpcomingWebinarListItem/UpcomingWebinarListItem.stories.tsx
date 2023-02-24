import { ComponentStory, ComponentMeta } from "@storybook/react";

import Box from "../../../Box";

import Component from ".";

export default {
  title: "Blogs & Webinars/Post List/UpcomingWebinarListItem",
  component: Component,
  decorators: [
    (Story) => (
      <Box $position="relative" $maxWidth={720} $ma="auto">
        <Story />
      </Box>
    ),
  ],
  argTypes: {
    argTypes: { signUpOnClick: { action: "clicked" } },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const UpcomingWebinarListItem = Template.bind({});
UpcomingWebinarListItem.args = {
  titleTag: "h3",
  title: "Why are teachers still using Oak?",
  summaryPortableText:
    "We know schools are facing yet another challenging term, with increasing numbers of staff and pupils isolating due to Covid, isolating due to Covid, isolating due to Covid, isolating due to Covid",
  date: "2052-03-31T14:30:00.000Z",
  slug: "why-oak",
  signUpHref: "https://example.com",
};
