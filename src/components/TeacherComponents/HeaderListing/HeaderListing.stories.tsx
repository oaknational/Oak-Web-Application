import { Meta, StoryObj } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { HeaderListingProps } from "./HeaderListing";

import Component from ".";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import unitListingFixture from "@/node-lib/curriculum-api-2023/fixtures/unitListing.fixture";
import type { UnitListingData } from "@/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";

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
type Story = StoryObj<typeof Component>;

export const WithUnitListingSeoAccordion: Story = {
  args: {
    ...headerListingProps,
    showUnitListingSeo: true,
  },
};

export const FinancialEducation: Story = {
  args: {
    ...headerListingProps,
    breadcrumbs: [
      ...headerListingProps.breadcrumbs.slice(0, 2),
      {
        oakLinkProps: {
          page: "programme-index",
          subjectSlug: "financial-education",
          keyStageSlug: "ks4",
        },
        label: "Financial education",
      },
    ],
    title: "Financial education",
    subjectSlug: "financial-education",
    subjectTitle: "Financial Education",
    subjectDescriptionUnitListingData: unitListingFixture({
      subjectSlug: "financial-education",
      keyStageSlug: "ks4",
      keyStageTitle: "Key Stage 4",
    }),
  },
};

const ruleOfLawKs1Fixture = unitListingFixture({
  subjectSlug: "rule-of-law" as UnitListingData["subjectSlug"],
  keyStageSlug: "ks1",
  keyStageTitle: "Key Stage 1",
  units: [[unitListingFixture().units.flat()[0]!]],
});

const ruleOfLawKs2Fixture = unitListingFixture({
  // TD: remove type assertion once curriculum schema is updated
  subjectSlug: "rule-of-law" as UnitListingData["subjectSlug"],
  keyStageSlug: "ks2",
  keyStageTitle: "Key Stage 2",
});

export const RuleOfLawKeyStage1: Story = {
  args: {
    ...headerListingProps,
    breadcrumbs: [
      { oakLinkProps: { page: "home" }, label: "Home" },
      {
        oakLinkProps: { page: "subject-index", keyStageSlug: "ks1" },
        label: "Key Stage 1",
      },
      {
        oakLinkProps: {
          page: "programme-index",
          subjectSlug: "rule-of-law",
          keyStageSlug: "ks1",
        },
        label: "Rule of law",
      },
    ],
    title: "Rule of law",
    programmeFactor: "Key Stage 1",
    keyStageTitle: "Key Stage 1",
    keyStageSlug: "ks1",
    subjectSlug: "rule-of-law",
    subjectTitle: "Rule of law",
    subjectDescriptionUnitListingData: ruleOfLawKs1Fixture,
  },
};

export const RuleOfLawKeyStage2: Story = {
  args: {
    ...headerListingProps,
    breadcrumbs: [
      { oakLinkProps: { page: "home" }, label: "Home" },
      {
        oakLinkProps: { page: "subject-index", keyStageSlug: "ks2" },
        label: "Key Stage 2",
      },
      {
        oakLinkProps: {
          page: "programme-index",
          subjectSlug: "rule-of-law",
          keyStageSlug: "ks2",
        },
        label: "Rule of law",
      },
    ],
    title: "Rule of law",
    programmeFactor: "Key Stage 2",
    keyStageTitle: "Key Stage 2",
    keyStageSlug: "ks2",
    subjectSlug: "rule-of-law",
    subjectTitle: "Rule of law",
    subjectDescriptionUnitListingData: ruleOfLawKs2Fixture,
  },
};
