import { StoryObj, Meta } from "@storybook/nextjs";

import { DownloadSuccessHeader } from "./DownloadSuccessHeader";

const meta: Meta<typeof DownloadSuccessHeader> = {
  component: DownloadSuccessHeader,
  title: "App/Programmes/Units/Lessons/DownloadSuccessHeader",
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof DownloadSuccessHeader>;

export const Default: Story = {
  args: {
    href: "/programmes",
  },
};
