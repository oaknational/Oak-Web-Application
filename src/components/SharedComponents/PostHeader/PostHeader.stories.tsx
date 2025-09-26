import { StoryFn, Meta } from "@storybook/nextjs";

import Component from "./PostHeader";

import PostHogDecorator from "@/storybook-decorators/PostHogDecorator";
import ToastDecorator from "@/storybook-decorators/ToastDecorator";

export default {
  decorators: [ToastDecorator, PostHogDecorator],
  component: Component,
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const PostHeader = {
  render: Template,

  args: {
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
  },
};
