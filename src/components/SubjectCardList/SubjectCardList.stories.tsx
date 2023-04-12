import { ComponentStory, ComponentMeta } from "@storybook/react";

import subjectPagePropsFixture from "../../node-lib/curriculum-api/fixtures/subjectPageProps";
import { getProgrammesBySubjectValues } from "../pages/SubjectListing.page";

import Component from "./SubjectCardList";

export default {
  title: "Lists/SubjectCardList/SubjectCardList",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const SubjectCardList = Template.bind({});

SubjectCardList.args = {
  subjects: getProgrammesBySubjectValues(
    subjectPagePropsFixture().programmesBySubjectAvailable
  ),
  isAvailable: true,
};

export const SubjectCardListUnavailable = Template.bind({});

SubjectCardListUnavailable.args = {
  subjects: getProgrammesBySubjectValues(
    subjectPagePropsFixture().programmesBySubjectUnavailable
  ),
  isAvailable: false,
};
