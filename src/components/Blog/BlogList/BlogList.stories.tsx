import { ComponentStory, ComponentMeta } from "@storybook/react";

import { BlogListProps } from "./BlogList";

import Component from ".";

const currentPageItems: BlogListProps["currentPageItems"] = [
  {
    titleTag: "h2",
    title: "The Long and Winding Road",
    summary:
      "The long and winding road  That leads to your door  Will never disappear  I've seen that road before  It always leads me here  Lead me to you door  The wild and windy night  That the rain washed away  Has left a pool of tears  Crying for the day  Why leave me standing here?  Let me know the way",
    slug: "long-road",
    contentType: "blog-post",
    category: { title: "Curriculum Planning", slug: "curriculum-planning" },
    date: new Date(2022, 7, 22).toISOString(),
    mainImage: null,
  },
  {
    titleTag: "h2",
    title: "Penny Lane",
    summary:
      'Penny Lane, there is a barber showing photographs Of every head he\'s had the pleasure to know And all the people that come and go Stop and say, "Hello"',
    slug: "long-road",
    contentType: "webinar",
    category: { title: "Curriculum Planning", slug: "curriculum-planning" },
    date: new Date(2022, 7, 17).toISOString(),
    thumbnailUrl: "3",
  },
  {
    titleTag: "h2",
    title: "Strawberry Fields Forever",
    summary:
      "No one I think is in my tree I mean, it must be high or low That is, you can't, you know, tune in but it's all right That is, I think it's not too bad",
    slug: "long-road",
    contentType: "blog-post",
    category: { title: "Curriculum Planning", slug: "curriculum-planning" },
    date: new Date(2022, 6, 26).toISOString(),
    mainImage: null,
  },
];

export default {
  title: "Blogs & Webinars/Blog List",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const BlogList = Template.bind({});
BlogList.args = {
  currentPageItems,
};

export const BlogListWithUpcomingWebinar = Template.bind({});
BlogListWithUpcomingWebinar.args = {
  upcomingItem: {
    titleTag: "h2",
    title: "She came in through the bathroom window",
    summary:
      'Penny Lane, there is a barber showing photographs Of every head he\'s had the pleasure to know And all the people that come and go Stop and say, "Hello"',
    slug: "long-road",
    contentType: "webinar",
    category: { title: "Curriculum Planning", slug: "curriculum-planning" },
    date: new Date(2059, 7, 17).toISOString(),
  },
  currentPageItems,
  withContainingHrs: true,
  withUpcomingItem: true,
};
