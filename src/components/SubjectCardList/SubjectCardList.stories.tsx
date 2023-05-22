import { ComponentStory, ComponentMeta } from "@storybook/react";

import AnalyticsDecorator from "../../storybook-decorators/AnalyticsDecorator";
import subjectPagePropsFixture from "../../node-lib/curriculum-api/fixtures/subjectPageProps";

import Component from "./SubjectCardList";

export default {
  title: "Lists/SubjectCardList/SubjectCardList",
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const SubjectCardList = Template.bind({});

SubjectCardList.args = {
  subjects: subjectPagePropsFixture().programmesBySubjectAvailable,
  isAvailable: true,
};

export const SubjectCardListUnavailable = Template.bind({});

SubjectCardListUnavailable.args = {
  subjects: subjectPagePropsFixture().programmesBySubjectUnavailable,
  isAvailable: false,
};
