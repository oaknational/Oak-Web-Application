import { StoryObj, Meta } from "@storybook/nextjs";

import { ShortReads } from "./ShortReads";

const meta = {
  component: ShortReads,
  tags: ["autodocs"],
  title: "App/TeachWithOak/ShortReads",
} satisfies Meta<typeof ShortReads>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {},
} satisfies Story;
