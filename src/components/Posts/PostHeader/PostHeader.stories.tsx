import { ComponentStory, ComponentMeta } from "@storybook/react";

import PostHogDecorator from "../../../storybook-decorators/PostHogDecorator";
import ToastDecorator from "../../../storybook-decorators/ToastDecorator";

import Component from "./PostHeader";

export default {
  title: "Blogs & Webinars/PostHeader",
  decorators: [ToastDecorator, PostHogDecorator],
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const PostHeader = Template.bind({});
PostHeader.args = {
  page: "blog-index",
  post: {
    title: "A blog",
    id: "5",
    date: "2025-01-01",
    slug: "a-blog",
    author: { id: "000", name: "Author McAuthorFace" },
    mainImage: {
      asset: {
        _id: "",
        url: "",
      },
    },
    summaryPortableText: "Lorem ipsum",
    contentPortableText: [],
    category: {
      title: "Lesson Plabning",
      slug: "lesson-planning",
    },
  },
};
