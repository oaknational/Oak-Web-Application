import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { ClerkProvider } from "@clerk/nextjs";

import {
  DownloadSuccessView,
  type DownloadSuccessViewProps,
} from "./DownloadSuccessView";

import { __setMockAuthState } from "@/storybook-mocks/clerk";
import NotificationsDecorator from "@/storybook-decorators/NotificationsDecorator";
import SaveCountDecorator from "@/storybook-decorators/SaveCountDecorator";
import type { LessonListSchema } from "@/node-lib/curriculum-api-2023/shared.schema";
import CookieConsentDecorator from "@/storybook-decorators/CookieConsentDecorator";

const lessons: LessonListSchema = [
  {
    lessonSlug: "transverse-waves",
    lessonTitle: "Transverse waves",
    description: "Describe transverse waves using diagrams.",
    pupilLessonOutcome: "I can represent transverse waves.",
    expired: false,
    orderInUnit: 1,
    lessonCohort: "2023-2024",
    isUnpublished: false,
    lessonReleaseDate: "2025-09-29T14:00:00.000Z",
    geoRestricted: false,
    loginRequired: false,
  },
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

const lessonWithUnitList: DownloadSuccessViewProps["lesson"] = {
  lessonTitle: "Transverse waves",
  lessonSlug: "transverse-waves",
  programmeSlug: "combined-science-secondary-ks4-foundation-edexcel",
  unitSlug: "measuring-waves",
  unitTitle: "Measuring waves",
  unitDescription:
    "This unit explores waves: representation, measurement, and applications.",
  lessonReleaseDate: "2025-09-29T14:00:00.000Z",
  lessons,
  unitvariantId: 1,
  keyStageSlug: "ks4",
  keyStageTitle: "Key Stage 4",
  subjectSlug: "combined-science",
  subjectTitle: "Combined science",
};

const meta: Meta<typeof DownloadSuccessView> = {
  component: DownloadSuccessView,
  tags: ["autodocs"],
  title: "App/Programmes/Units/Lessons/DownloadSuccessView",
  decorators: [
    SaveCountDecorator,
    NotificationsDecorator,
    CookieConsentDecorator,
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

type Story = StoryObj<typeof DownloadSuccessView>;

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
    ctaVariant: "control",
  },
};

export const TestVariant: Story = {
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
    ctaVariant: "test",
  },
};
