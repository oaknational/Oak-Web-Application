import { Meta, StoryObj } from "@storybook/react";

import AnalyticsDecorator from "../../../storybook-decorators/AnalyticsDecorator";

import Component from ".";

const meta: Meta<typeof Component> = {
  title: "Filters/Category Filter List",
  decorators: [AnalyticsDecorator],
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const CategoryFilterList: Story = {
  args: {
    categories: [
      {
        linkProps: { page: "blog-index", categorySlug: "" },
        label: "Oak updates",
      },
      {
        linkProps: { page: "blog-index", categorySlug: "lesson-planning" },
        label: "Lesson planning",
      },
      {
        linkProps: { page: "blog-index", categorySlug: "teaching-learning" },
        label: "Teaching and learning",
      },
      {
        linkProps: { page: "blog-index", categorySlug: "research" },
        label: "Research and insights",
      },
    ],
  },
  render: (args) => {
    // get functionality working
    // const { getIsSelected, setSelected } = useCategoryFilterList({
    //   selectedKey: 'lesson-planning',
    //   getKey: (linkProps: BlogListingLinkProps | WebinarListingLinkProps) =>
    //     linkProps.category || null,
    // });
    return <Component {...args} />;
  },
};
