import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./MathJaxWrapper";

export default {
  title: "MathJax/Wrapper ",
  component: Component,
} as ComponentMeta<typeof Component>;

const data =
  "When \\(a \\ne 0\\), there exists two solutions for \\(ax^2 + bx + c = 0\\) as \\[x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.\\]";

const Template: ComponentStory<typeof Component> = () => (
  <Component>{data}</Component>
);

export const MathJaxWrapper = Template.bind({});
