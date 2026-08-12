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
    <div>
      <div>
        <Component
          items={[{ text: "one" }, { text: "two" }, { text: "three" }]}
        />
      </div>
      <div>
        <Component items={[{ text: "single" }]} />
      </div>
    </div>
  );
};

export const BulletList: Story = {
  render: TestComponent,
};
