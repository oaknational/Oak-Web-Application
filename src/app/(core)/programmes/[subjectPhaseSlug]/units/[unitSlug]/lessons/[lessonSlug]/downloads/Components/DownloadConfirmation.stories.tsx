import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { ClerkProvider } from "@clerk/nextjs";

import { __setMockAuthState } from "../../../../../../../../../../../.storybook/mocks/clerk";

import { DownloadConfirmation } from "./DownloadConfirmation";

import lessonDownloadsFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonDownloads.fixture";
import type { LessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import NotificationsDecorator from "@/storybook-decorators/NotificationsDecorator";
import SaveCountDecorator from "@/storybook-decorators/SaveCountDecorator";

const lessons: NonNullable<LessonDownloadsPageData["lessons"]> = [
  {
    lessonSlug: "representing-transverse-waves",
    lessonTitle: "Representing transverse waves",
    description: "Describe transverse waves using diagrams.",
    pupilLessonOutcome: "I can represent transverse waves.",
    expired: false,
    orderInUnit: 2,
    lessonCohort: "2023-2024",
    isUnpublished: false,
    lessonReleaseDate: null,
    geoRestricted: false,
    loginRequired: false,
  },
  {
    lessonSlug: "representing-longitudinal-waves",
    lessonTitle: "Representing longitudinal waves",
    description: "Describe longitudinal waves using diagrams.",
    pupilLessonOutcome: "I can represent longitudinal waves.",
    expired: false,
    orderInUnit: 3,
    lessonCohort: "2023-2024",
    isUnpublished: false,
    lessonReleaseDate: null,
    geoRestricted: false,
    loginRequired: false,
  },
];

const lessonWithUnitList = lessonDownloadsFixture({
  lessons,
  unitDescription:
    "This unit explores waves: representation, measurement, and applications.",
});

const meta: Meta<typeof DownloadConfirmation> = {
  component: DownloadConfirmation,
  tags: ["autodocs"],
  title: "App/Programmes/Units/Lessons/DownloadConfirmation",
  decorators: [
    SaveCountDecorator,
    NotificationsDecorator,
    (Story) => (
      <ClerkProvider>
        <OakThemeProvider theme={oakDefaultTheme}>
          <Story />
        </OakThemeProvider>
      </ClerkProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof DownloadConfirmation>;

export const Default: Story = {
  decorators: [
    (Story) => {
      __setMockAuthState({
        isSignedIn: true,
        isOnboarded: true,
        isRegionAuthorised: true,
      });
      return <Story />;
    },
  ],
  args: {
    lesson: lessonWithUnitList,
  },
};
