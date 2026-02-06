import { Meta, StoryObj } from "@storybook/nextjs";
import { OakUiRoleToken } from "@oaknational/oak-components";

import CurricQuote from "./CurricQuote";

const meta: Meta<typeof CurricQuote> = {
  component: CurricQuote,
  tags: ["autodocs"],
  title: "Components/CurriculumComponents/CurricQuote",
  argTypes: {
    title: {
      control: "text",
    },
    children: {
      control: "text",
    },
    backgroundColor: {
      control: "select",
      options: [
        "bg-decorative1-main",
        "bg-decorative1-subdue",
        "bg-decorative1-very-subdued",
        "bg-decorative5-main",
        "bg-decorative5-subdued",
        "bg-primary",
        "bg-neutral",
      ] as OakUiRoleToken[],
      description: "Background color of the quote box",
    },
    barColor: {
      control: "select",
      options: [
        "bg-success",
        "bg-decorative1-main",
        "bg-decorative1-very-subdued",
        "bg-decorative5-main",
        "bg-inverted",
        "bg-primary",
      ] as OakUiRoleToken[],
      description: "Color of the decorative vertical bar",
    },
    headingProps: {
      control: "object",
      description:
        'Props to pass to the OakHeading component (e.g., { $font: "heading-4" })',
    },
    paragraphProps: {
      control: "object",
      description:
        'Props to pass to the OakP component (e.g., { $color: "red" })',
    },
  },
  parameters: {
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#fff" },
        { name: "grey", value: "#f2f2f2" },
        { name: "dark", value: "#333" },
      ],
    },
  },
};

export default meta;

type Story = StoryObj<typeof CurricQuote>;

export const Default: Story = {
  args: {
    title: "Evidence-informed",
    children:
      "Our approach enables the rigorous application of research outcomes, science of learning and impactful best practice.",
    backgroundColor: "transparent",
    barColor: "bg-decorative1-main",
  },
};

export const AlternativeColors: Story = {
  args: {
    title: "Accessible & Inclusive",
    children:
      "Designed to be adaptable for all learners, ensuring every student can achieve.",
    backgroundColor: "bg-decorative5-subdued",
    barColor: "text-success",
  },
};

export const WithCustomTextStyling: Story = {
  args: {
    ...Default.args,
    title: "Custom Styled Title",
    headingProps: {
      tag: "h5",
      $font: "heading-4",
      $color: "text-success",
    },
    paragraphProps: {
      $font: "body-2-bold",
      $color: "text-subdued",
    },
  },
};
