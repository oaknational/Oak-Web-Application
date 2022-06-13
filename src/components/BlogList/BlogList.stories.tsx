import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

export default {
  title: "Lists/BlogList",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const BlogList = Template.bind({});
BlogList.args = {
  title: "Check out these things!",
  titleTag: "h1",
  items: [
    {
      titleTag: "h2",
      title: "The Long and Winding Road",
      snippet:
        "The long and winding road  That leads to your door  Will never disappear  I've seen that road before  It always leads me here  Lead me to you door  The wild and windy night  That the rain washed away  Has left a pool of tears  Crying for the day  Why leave me standing here?  Let me know the way",
      href: "/",
      contentType: "blog-post",
    },
    {
      titleTag: "h2",
      title: "Penny Lane",
      snippet:
        'Penny Lane, there is a barber showing photographs Of every head he\'s had the pleasure to know And all the people that come and go Stop and say, "Hello"',
      href: "/",
      contentType: "webinar",
    },
    {
      titleTag: "h2",
      title: "Strawberry Fields Forever",
      snippet:
        "No one I think is in my tree I mean, it must be high or low That is, you can't, you know, tune in but it's all right That is, I think it's not too bad",
      href: "/",
      contentType: "blog-post",
    },
  ],
};
