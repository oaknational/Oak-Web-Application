import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, userEvent, within } from "storybook/test";

import {
  guidanceData,
  hubData,
  storyPortableText,
} from "../../__fixtures__/stories";

import { NationalCurriculumInsightsFaq } from "./Faq";

const meta = {
  component: NationalCurriculumInsightsFaq,
  parameters: { layout: "fullscreen" },
  args: {
    data: hubData,
    section: {
      __typename: "NationalCurriculumInsightsFaqSection",
      heading: "Frequently asked questions",
      items: [
        {
          question: "What does this page cover?",
          answerPortableText: storyPortableText(
            "Guidance to help you plan for curriculum changes.",
          ),
        },
        {
          question: "Can I download the guidance?",
          answerPortableText: storyPortableText(
            "Choose a subject and phase in the download form.",
          ),
        },
      ],
    },
  },
} satisfies Meta<typeof NationalCurriculumInsightsFaq>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Hub: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole("button", {
      name: "What does this page cover?",
    });
    const second = canvas.getByRole("button", {
      name: "Can I download the guidance?",
    });
    await expect(first).toHaveAttribute("aria-expanded", "true");
    await expect(second).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(second);
    await expect(second).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(second);
  },
};
export const Guidance: Story = { args: { data: guidanceData } };
