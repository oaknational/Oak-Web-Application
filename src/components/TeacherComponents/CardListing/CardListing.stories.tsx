import { Meta, StoryObj } from "@storybook/nextjs";
import {
  oakDefaultTheme,
  OakFlex,
  OakThemeProvider,
} from "@oaknational/oak-components";

import CardListing from "./CardListing";

const meta: Meta<typeof CardListing> = {
  component: CardListing,
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
  parameters: {
    controls: {
      include: [],
    },
  },
};

export default meta;

const defaultArgs = {
  isHighlighted: false,
  index: 10,
  title:
    "Ullamcorper auctor volutpat turpis dictumst aliquam et et dui mattis ullamcorper.",
  subcopy: "Ullamcorper auctor volutpat",
  tags: [
    { label: "Tag 1" },
    { label: "Tag 2" },
    { label: "Tag 3" },
    { label: "Tag 4" },
    { label: "Tag 5" },
    { label: "Tag 6" },
  ],
  showSave: true,
  lessonCount: 10,
};

type Story = StoryObj<typeof CardListing>;

export const Customisable: Story = {
  render: (args) => <CardListing {...args} />,
  args: defaultArgs,
  argTypes: {
    tags: {
      control: {
        type: "select",
      },
      options: ["copyright", "list", "none"],
      mapping: {
        copyright: [{ label: "Copyright", icon: "copyright" }],
        list: defaultArgs.tags,
        none: undefined,
      },
    },
  },
  parameters: {
    controls: {
      include: [
        "layoutVariant",
        "title",
        "subcopy",
        "lessonCount",
        "isHighlighted",
        "showSave",
        "tags",
      ],
    },
  },
};

export const Vertical: Story = {
  render: (args) => (
    <OakFlex $gap={"spacing-20"}>
      <OakFlex $width={"spacing-240"}>
        <CardListing
          {...args}
          title="Vertical layout"
          layoutVariant="vertical"
        />
      </OakFlex>
      <OakFlex $width={"spacing-240"}>
        <CardListing
          {...args}
          layoutVariant="vertical"
          subcopy={undefined}
          title="Without subcopy"
        />
      </OakFlex>
      <OakFlex $width={"spacing-240"}>
        <CardListing
          {...args}
          layoutVariant="vertical"
          isHighlighted={true}
          title="Highlighted"
        />
      </OakFlex>
      <OakFlex $width={"spacing-240"}>
        <CardListing
          {...args}
          layoutVariant="vertical"
          showSave={false}
          lessonCount={undefined}
          title="Without lesson count and save button"
        />
      </OakFlex>
    </OakFlex>
  ),
  args: defaultArgs,
};

export const Horizontal: Story = {
  render: (args) => (
    <OakFlex $flexDirection={"column"} $gap={"spacing-20"}>
      <CardListing
        {...args}
        layoutVariant="horizontal"
        title="Horizontal layout"
      />
      <CardListing
        {...args}
        layoutVariant="horizontal"
        subcopy={undefined}
        title="Without subcopy"
      />
      <CardListing
        {...args}
        layoutVariant="horizontal"
        isHighlighted={true}
        title="Highlighted"
      />
      <CardListing
        {...args}
        layoutVariant="horizontal"
        showSave={false}
        lessonCount={undefined}
        title="Without lesson count and save button"
      />
    </OakFlex>
  ),
  args: defaultArgs,
};
