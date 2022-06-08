import { ComponentStory, ComponentMeta } from "@storybook/react";
import styled from "styled-components";

import Component from ".";

export default {
  title: "Interactive/Lesson Control",
  component: Component,
  argTypes: {
    label: { defaultValue: "Intro" },
  },
} as ComponentMeta<typeof Component>;

const Container = styled.div`
  width: 182px;
`;

const Template: ComponentStory<typeof Component> = (args) => (
  <Container>
    <Component {...args} />
  </Container>
);

export const Default = Template.bind({});
export const Current = Template.bind({});
Current.args = {
  status: "current",
};
export const Complete = Template.bind({});
Complete.args = {
  status: "complete",
};
export const WithBadge = Template.bind({});
WithBadge.args = {
  status: "complete",
  badgeProps: { text: "33%" },
};
export const WithOverflowingText = Template.bind({});
WithOverflowingText.args = {
  status: "complete",
  label: "Very long label",
  badgeProps: { text: "33%" },
};
