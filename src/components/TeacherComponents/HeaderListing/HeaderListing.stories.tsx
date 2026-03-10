import { Meta } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { HeaderListingProps } from "./HeaderListing";

import Component from ".";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import unitListingFixture from "@/node-lib/curriculum-api-2023/fixtures/unitListing.fixture";

export const headerListingProps: HeaderListingProps = {
  breadcrumbs: [
    {
      oakLinkProps: {
        page: "home",
      },
      label: "Home",
    },
    {
      oakLinkProps: {
        page: "subject-index",
        keyStageSlug: "ks4",
      },
      label: "Key Stage 4",
    },
    {
      oakLinkProps: {
        page: "programme-index",
        subjectSlug: "english",
        keyStageSlug: "ks4",
      },
      label: "English",
    },
  ],
  background: "bg-decorative3-very-subdued",
  subjectIconBackgroundColor: "bg-decorative3-main",
  title: "English",
  programmeFactor: "Key Stage 4",
  keyStageTitle: "Key Stage 4",
  keyStageSlug: "ks4",
  subjectSlug: "english",
  subjectTitle: "English",
  isNew: false,
  subjectDescriptionUnitListingData: unitListingFixture({
    subjectSlug: "english",
    keyStageSlug: "ks4",
    keyStageTitle: "Key Stage 4",
  }),
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
  args: headerListingProps,
};

export default meta;

type Story = import("@storybook/nextjs").StoryObj<typeof Component>;

export const WithUnitListingSeoAccordion: Story = {
  args: {
    ...headerListingProps,
    showUnitListingSeo: true,
  },
};
