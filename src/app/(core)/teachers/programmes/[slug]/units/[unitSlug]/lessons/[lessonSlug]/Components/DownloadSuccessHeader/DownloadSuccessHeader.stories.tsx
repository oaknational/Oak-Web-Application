import { StoryObj, Meta } from "@storybook/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { DownloadSuccessHeader } from "./DownloadSuccessHeader";

import CookieConsentDecorator from "@/storybook-decorators/CookieConsentDecorator";

const meta: Meta<typeof DownloadSuccessHeader> = {
  component: DownloadSuccessHeader,
  title: "App/Programmes/Units/Lessons/DownloadSuccessHeader",
  tags: ["autodocs"],
  decorators: [
    CookieConsentDecorator,
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof DownloadSuccessHeader>;

export const Default: Story = {
  args: {
    href: "/programmes",
  },
};
