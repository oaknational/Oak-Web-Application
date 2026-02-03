import { Meta, StoryObj } from "@storybook/nextjs";
import {
  oakDefaultTheme,
  OakFlex,
  OakThemeProvider,
  OakTypography,
} from "@oaknational/oak-components";
import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

import CardListing from "./CardListing";

import { saveCountContext } from "@/context/SaveCount/SaveCountProvider";
import { oakNotificationsContext } from "@/context/OakNotifications/OakNotificationsProvider";

const MockSaveCountProvider = ({ children }: { children: ReactNode }) => {
  const SaveCountProvider = saveCountContext.Provider;

  const value = {
    savedUnitsCount: 0,
    incrementSavedUnitsCount: () => console.log("save +1"),
    decrementSavedUnitsCount: () => console.log("save -1"),
    setSavedUnitsCount: () => console.log("save units count"),
  };

  return <SaveCountProvider value={value}>{children}</SaveCountProvider>;
};

const MockNotificationsProvider = ({ children }: { children: ReactNode }) => {
  const NotificationsProvider = oakNotificationsContext.Provider;

  const value = {
    currentToastProps: null,
    setCurrentToastProps: () => console.log("set toast props"),
    currentBannerProps: null,
    setCurrentBannerProps: () => console.log("set banner props"),
  };

  return (
    <NotificationsProvider value={value}>{children}</NotificationsProvider>
  );
};

const meta: Meta<typeof CardListing> = {
  component: CardListing,
  decorators: [
    (Story) => (
      <ClerkProvider>
        <OakThemeProvider theme={oakDefaultTheme}>
          <MockSaveCountProvider>
            <MockNotificationsProvider>
              <Story />
            </MockNotificationsProvider>
          </MockSaveCountProvider>
        </OakThemeProvider>
      </ClerkProvider>
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
  title:
    "Ullamcorper auctor volutpat turpis dictumst aliquam et et dui mattis ullamcorper.",
  saveProps: {
    unitTitle: "My world: Art and nature",
    unitSlug: "my-world-art-and-nature",
    programmeSlug: "art-primary-ks1",
  },
  href: "fakeurl.com",
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
    saveProps: {
      control: { type: "select" },
      options: [undefined, defaultArgs.saveProps],
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
        "tags",
        "disabled",
        "saveProps",
      ],
    },
  },
};

export const Vertical: Story = {
  render: (args) => (
    <OakFlex $flexWrap={"wrap"} $gap={"spacing-20"}>
      <OakFlex
        $flexDirection={"column"}
        $gap={"spacing-16"}
        $width={"spacing-240"}
      >
        <OakTypography $font={"heading-5"}>Vertical layout</OakTypography>
        <CardListing {...args} layoutVariant="vertical" />
      </OakFlex>
      <OakFlex
        $flexDirection={"column"}
        $gap={"spacing-16"}
        $width={"spacing-240"}
      >
        <OakTypography $font={"heading-5"}>
          With no optional props
        </OakTypography>
        <CardListing
          {...args}
          layoutVariant="vertical"
          subcopy={undefined}
          lessonCount={undefined}
          tags={undefined}
          saveProps={undefined}
        />
      </OakFlex>
      <OakFlex
        $flexDirection={"column"}
        $gap={"spacing-16"}
        $width={"spacing-240"}
      >
        <OakTypography $font={"heading-5"}>With no subcopy</OakTypography>
        <CardListing {...args} layoutVariant="vertical" subcopy={undefined} />
      </OakFlex>
      <OakFlex
        $flexDirection={"column"}
        $gap={"spacing-16"}
        $width={"spacing-240"}
      >
        <OakTypography $font={"heading-5"}>Highlighted</OakTypography>
        <CardListing {...args} layoutVariant="vertical" isHighlighted={true} />
      </OakFlex>
      <OakFlex
        $flexDirection={"column"}
        $gap={"spacing-16"}
        $width={"spacing-240"}
      >
        <OakTypography $font={"heading-5"}>Without lesson count</OakTypography>
        <CardListing
          {...args}
          layoutVariant="vertical"
          lessonCount={undefined}
        />
      </OakFlex>
      <OakFlex
        $flexDirection={"column"}
        $gap={"spacing-16"}
        $width={"spacing-240"}
      >
        <OakTypography $font={"heading-5"}>Without save button</OakTypography>
        <CardListing {...args} layoutVariant="vertical" saveProps={undefined} />
      </OakFlex>
      <OakFlex
        $flexDirection={"column"}
        $gap={"spacing-16"}
        $width={"spacing-240"}
      >
        <OakTypography $font={"heading-5"}>Disabled</OakTypography>
        <CardListing {...args} layoutVariant="vertical" disabled />
      </OakFlex>
      <OakFlex
        $flexDirection={"column"}
        $gap={"spacing-16"}
        $width={"spacing-240"}
      >
        <OakTypography $font={"heading-5"}>Visited link</OakTypography>
        <CardListing
          {...args}
          layoutVariant="vertical"
          href="https://google.com"
        />
      </OakFlex>
    </OakFlex>
  ),
  args: defaultArgs,
};

export const Horizontal: Story = {
  render: (args) => (
    <OakFlex $flexDirection={"column"} $gap={"spacing-20"}>
      <OakFlex $flexDirection={"column"} $gap={"spacing-16"}>
        <OakTypography $font={"heading-5"}>Horizontal layout</OakTypography>
        <CardListing {...args} layoutVariant="horizontal" />
      </OakFlex>
      <OakFlex $flexDirection={"column"} $gap={"spacing-16"}>
        <OakTypography $font={"heading-5"}>
          With no optional props
        </OakTypography>
        <CardListing
          {...args}
          layoutVariant="horizontal"
          subcopy={undefined}
          saveProps={undefined}
          lessonCount={undefined}
          tags={undefined}
        />
      </OakFlex>
      <OakFlex $flexDirection={"column"} $gap={"spacing-16"}>
        <OakTypography $font={"heading-5"}>With no subcopy</OakTypography>
        <CardListing {...args} layoutVariant="horizontal" subcopy={undefined} />
      </OakFlex>
      <OakFlex $flexDirection={"column"} $gap={"spacing-16"}>
        <OakTypography $font={"heading-5"}>Highlighted</OakTypography>
        <CardListing
          {...args}
          layoutVariant="horizontal"
          isHighlighted={true}
        />
      </OakFlex>
      <OakFlex $flexDirection={"column"} $gap={"spacing-16"}>
        <OakTypography $font={"heading-5"}>Without lesson count</OakTypography>
        <CardListing
          {...args}
          layoutVariant="horizontal"
          lessonCount={undefined}
        />
      </OakFlex>
      <OakFlex $flexDirection={"column"} $gap={"spacing-16"}>
        <OakTypography $font={"heading-5"}>Without save button</OakTypography>
        <CardListing
          {...args}
          layoutVariant="horizontal"
          saveProps={undefined}
        />
      </OakFlex>
      <OakFlex $flexDirection={"column"} $gap={"spacing-16"}>
        <OakTypography $font={"heading-5"}>Disabled</OakTypography>
        <CardListing {...args} layoutVariant="horizontal" disabled />
      </OakFlex>
      <OakFlex $flexDirection={"column"} $gap={"spacing-16"}>
        <OakTypography $font={"heading-5"}>Visited link</OakTypography>
        <CardListing
          {...args}
          layoutVariant="horizontal"
          href="https://google.com"
        />
      </OakFlex>
    </OakFlex>
  ),
  args: defaultArgs,
};
