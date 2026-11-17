import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, userEvent, within } from "storybook/test";

import { hubData, subjectData } from "../__fixtures__/stories";

import { NationalCurriculumInsightsDownload } from "./Download";

const meta = {
  component: NationalCurriculumInsightsDownload,
  parameters: { layout: "fullscreen" },
  args: {
    data: hubData,
    section: {
      __typename: "NationalCurriculumInsightsDownloadSection",
      barHeading: "The national curriculum is changing.",
      barCtaLabel: "Download free expert guidance.",
      detailsHeading: "Your details",
      downloadsHeading: "Choose your subjects",
      downloadsIntroduction: "Select the subjects and phases you need.",
      downloadButtonLabel: "Download",
    },
  },
} satisfies Meta<typeof NationalCurriculumInsightsDownload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {};
export const Expanded: Story = {
  args: { data: subjectData },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("button", {
      name: /The national curriculum is changing/,
    });
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(
      canvas.getByRole("textbox", { name: "Name (required)" }),
    ).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "Download 0 insights (.DOCX)" }),
    ).toBeDisabled();
  },
};
