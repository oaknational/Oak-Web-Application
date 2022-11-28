import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

export default {
  title: "Blogs & Webinars/PostCategoryList",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const PostCategoryList = Template.bind({});
PostCategoryList.args = {
  page: "blog-index",
  categories: [
    { slug: "oak-updates", title: "Oak updates" },
    { slug: "lesson-planning", title: "Lesson planning" },
    { slug: "teaching-learning", title: "Teaching and learning" },
    { slug: "research", title: "Research and insights" },
  ],
  selectedCategorySlug: null,
};
