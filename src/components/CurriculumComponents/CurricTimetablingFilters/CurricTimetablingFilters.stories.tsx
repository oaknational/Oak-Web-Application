import { Meta, StoryObj } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import Component from ".";

import { createFilter } from "@/fixtures/curriculum/filters";
import { createYearData } from "@/fixtures/curriculum/yearData";
import { createUnit } from "@/fixtures/curriculum/unit";
import { createThread } from "@/fixtures/curriculum/thread";

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ["autodocs"],
  argTypes: {
    filters: {
      type: "string",
      description: "String or ReactNode",
    },
  },
  parameters: {
    controls: {
      include: ["titleSlot", "additionalSlot", "illustrationSlug"],
    },
  },
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
  render: (args) => <Component {...args} />,
};

export default meta;
type Story = StoryObj<typeof Component>;

const thread1 = createThread({ slug: "Addition" });
const thread2 = createThread({ slug: "Subtraction" });

export const Default: Story = {
  args: {
    filters: createFilter(),
    data: {
      yearData: {
        "1": createYearData({
          units: [
            createUnit({
              slug: "test-1",
              year: "1",
              threads: [thread1, thread2],
            }),
            createUnit({ slug: "test-2", year: "2" }),
          ],
        }),
      },
      threadOptions: [thread1, thread2],
      yearOptions: ["1", "2"],
      keystages: [],
    },
    slugs: {
      phaseSlug: "primary",
      subjectSlug: "english",
      ks4OptionSlug: null,
    },
  },
};
