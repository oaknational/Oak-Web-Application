import { Meta, StoryObj } from "@storybook/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import DesktopUnitFilters from "./DesktopUnitFilters";

const meta: Meta<typeof DesktopUnitFilters> = {
  component: DesktopUnitFilters,
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof DesktopUnitFilters>;

export const Default: Story = {
  render: (args) => <DesktopUnitFilters {...args} />,

  args: {
    keyStageSlug: "ks4",
    keyStageTitle: "Key Stage 4",
    programmeSlug: "maths-secondary-ks4-foundation",
    selectedThemeSlug: "ratio-and-proportion",
    subjectSlug: "maths",
    subjectTitle: "Maths",
    yearGroupSlug: "year-10",
    yearGroups: [
      {
        yearTitle: "Year 10",
        year: "year-10",
      },
      {
        yearTitle: "Year 11",
        year: "year-11",
      },
    ],
    learningThemes: [
      {
        themeTitle: "Algebra",
        themeSlug: "algebra",
      },
      {
        themeTitle: "Geometry and Measure",
        themeSlug: "geometry-and-measure",
      },
      {
        themeTitle: "Number",
        themeSlug: "number",
      },
      {
        themeTitle: "Probability",
        themeSlug: "probability",
      },
      {
        themeTitle: "Ratio and Proportion",
        themeSlug: "ratio-and-proportion",
      },
      {
        themeTitle: "Statistics",
        themeSlug: "statistics",
      },
    ],
    subjectCategories: [
      {
        label: "Maths",
        iconName: "maths-icon",
        slug: "maths",
      },
      {
        label: "Science",
        iconName: "science-icon",
        slug: "science",
      },
    ],
    learningThemesId: "theme1",
  },
};
