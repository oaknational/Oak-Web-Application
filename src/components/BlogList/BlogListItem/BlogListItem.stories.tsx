import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

export default {
  title: "Lists/BlogListItem",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const BlogListItem = Template.bind({});
BlogListItem.args = {
  titleTag: "h3",
  title: "The long and winding road",
  snippet:
    "The long and winding road  That leads to your door  Will never disappear  I've seen that road before  It always leads me here  Lead me to you door  The wild and windy night  That the rain washed away  Has left a pool of tears  Crying for the day  Why leave me standing here?  Let me know the way",
  href: "/",
  contentType: "blog-post",
};
