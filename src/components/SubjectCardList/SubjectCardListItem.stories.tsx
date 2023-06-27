import { ComponentStory, ComponentMeta } from "@storybook/react";

import AnalyticsDecorator from "../../storybook-decorators/AnalyticsDecorator";
import subjectPagePropsFixture from "../../node-lib/curriculum-api/fixtures/subjectPageProps";

import Component from "./SubjectCardListItem";

export default {
  title: "Lists/SubjectCardList/SubjectCardListItem",
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const SubjectCardListItem = Template.bind({});

SubjectCardListItem.args = {
  programmes: subjectPagePropsFixture().programmesBySubjectAvailable[0],
  isAvailable: true,
};

export const SubjectCardListItemUnavailable = Template.bind({});

SubjectCardListItemUnavailable.args = {
  programmes: subjectPagePropsFixture().programmesBySubjectUnavailable[0],
  isAvailable: true,
};
