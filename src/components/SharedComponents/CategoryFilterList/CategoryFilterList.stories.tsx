import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/nextjs";

import { Category } from "./CategoryFilterListItem";
import useCategoryFilterList from "./useCategoryFilterList";

import Component from ".";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import { BlogListingLinkProps } from "@/common-lib/urls";

const mockCategories: Category<BlogListingLinkProps>[] = [
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
];

const CategoryFilterListWithHooks = () => {
  const { getIsSelected, setSelected } = useCategoryFilterList({
    selectedKey: "lesson-planning",
    getKey: (linkProps: BlogListingLinkProps) => linkProps.categorySlug || null,
  });

  return (
    <Component
      labelledBy="category-filter"
      categories={mockCategories}
      getIsSelected={getIsSelected}
      setSelected={setSelected}
    />
  );
};

const meta: Meta<typeof Component> = {
  decorators: [
    AnalyticsDecorator,
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const CategoryFilterList: Story = {
  render: () => <CategoryFilterListWithHooks />,
};
