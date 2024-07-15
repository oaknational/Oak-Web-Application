import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import Component from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const CurriculumDownloadView: Story = {
  args: {},
  render: function StoryComponent() {
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Component
          curriculumSelectionSlugs={{
            subjectSlug: "subject",
            phaseSlug: "phase",
            examboardSlug: "examboard",
          }}
          cache={3425335645654}
          onDownloadComplete={action("onDownloadComplete")}
        />
      </OakThemeProvider>
    );
  },
};
