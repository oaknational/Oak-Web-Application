import React from "react";
import { StoryObj, Meta } from "@storybook/react";
import { OakInlineBanner } from "@oaknational/oak-components";

import { UnitsHeader } from "./UnitsHeader";

const meta: Meta<typeof UnitsHeader> = {
  component: UnitsHeader,
  tags: ["autodocs"],
  argTypes: {
    isLegacy: { type: "boolean" },
    subject: { type: "string" },
    phase: { type: "string" },
    curriculumHref: {
      control: {
        type: "radio",
      },
      options: ["Url", "Null"],
      mapping: { Url: "https://www.thenational.academy", Null: null },
    },
    banner: {
      control: {
        type: "select",
      },
      options: ["show", "hide"],
      mapping: {
        empty: [],
        show: (
          <OakInlineBanner
            isOpen={true}
            message={"Example banner text"}
            type="neutral"
            $width={"100%"}
          />
        ),
        hide: null,
      },
    },
  },
  parameters: {
    controls: {
      include: ["isLegacy", "subject", "phase", "curriculumHref", "banner"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof UnitsHeader>;

export const Default: Story = {
  render: (args) => <UnitsHeader {...args} />,
  args: {
    isLegacy: false,
    subject: "maths",
    phase: "secondary",
    curriculumHref: "Url",
  },
};
