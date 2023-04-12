import { ComponentStory, ComponentMeta } from "@storybook/react";

import subjectPagePropsFixture from "../../node-lib/curriculum-api/fixtures/subjectPageProps";
import { getProgrammesBySubjectValues } from "../pages/SubjectListing.page";

import Component from "./SubjectCardListItem";

export default {
  title: "Lists/SubjectCardList/SubjectCardListItem",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const SubjectCardListItem = Template.bind({});

SubjectCardListItem.args = {
  subject: getProgrammesBySubjectValues(
    subjectPagePropsFixture().programmesBySubjectAvailable
  )[0],
  isAvailable: true,
};

export const SubjectCardListItemUnavailable = Template.bind({});

SubjectCardListItemUnavailable.args = {
  subject: getProgrammesBySubjectValues(
    subjectPagePropsFixture().programmesBySubjectUnavailable
  )[0],
  isAvailable: true,
};
