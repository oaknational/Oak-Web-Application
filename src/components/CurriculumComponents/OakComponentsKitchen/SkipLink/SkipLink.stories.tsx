import { Meta, StoryObj } from "@storybook/nextjs";

import Component from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

const TestComponent = () => {
  return (
    <>
      <p>There is a skip link under this paragraph</p>
      <Component href="#testing">Skip to content</Component>
      <p>There is a skip link above this paragraph</p>
    </>
  );
};

export const SkipLink: Story = {
  render: TestComponent,
};
