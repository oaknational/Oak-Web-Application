import { Meta, StoryObj } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { SearchSuggestionBanner as Component } from "./SearchSuggestionBanner";

import { SearchIntent } from "@/common-lib/schemas/search-intent";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof Component>;

const searchIntentWithDirectSubjectAndKeystageMatch: SearchIntent = {
  directMatch: {
    subject: { slug: "maths", title: "Maths" },
    keyStage: { slug: "ks2", title: "Key stage 2" },
    examBoard: null,
    year: null,
  },
  suggestedFilters: [],
};

export const Default: Story = {
  args: {
    intent: searchIntentWithDirectSubjectAndKeystageMatch,
  },
  render: (args) => (
    <OakThemeProvider theme={oakDefaultTheme}>
      <Component {...args} />
    </OakThemeProvider>
  ),
};
