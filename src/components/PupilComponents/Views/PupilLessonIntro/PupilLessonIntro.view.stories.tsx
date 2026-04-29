import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  OakBackLink,
  OakFlex,
  OakLessonTopNav,
  OakP,
  OakPrimaryInvertedButton,
  OakSpan,
  OakThemeProvider,
  OakUL,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { PupilLessonIntroView } from "./PupilLessonIntro.view";
import { PupilLessonIntroAdditionalFileItem } from "./PupilLessonIntroAdditionalFileItem";
import { PupilLessonIntroInfoCard } from "./PupilLessonIntroInfoCard";
import { PupilLessonIntroLicence } from "./PupilLessonIntroLicence";
import { PupilLessonIntroReadyCard } from "./PupilLessonIntroReadyCard";

const meta = {
  component: PupilLessonIntroView,
  decorators: [
    (StoryComponent) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <StoryComponent />
      </OakThemeProvider>
    ),
  ],
} satisfies Meta<typeof PupilLessonIntroView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    phase: "primary",
    topNavSlot: (
      <OakLessonTopNav
        backLinkSlot={<OakBackLink href="#" label="Back to overview" />}
        heading="Introduction"
        lessonSectionName="intro"
        mobileSummary={
          <OakSpan $color="text-primary" $font="body-3">
            In progress...
          </OakSpan>
        }
      />
    ),
    readyToLearnSlot: <PupilLessonIntroReadyCard />,
    lessonInfoSlot: (
      <>
        <PupilLessonIntroInfoCard
          title="Files you will need for this lesson"
          iconName="additional-material"
        >
          <OakUL
            $display="flex"
            $flexDirection="column"
            $gap="spacing-16"
            $reset
          >
            <PupilLessonIntroAdditionalFileItem
              displayName="Worksheet"
              bytes={1_400_000}
              url="https://example.org/file.pdf"
            />
            <PupilLessonIntroAdditionalFileItem
              displayName="Vocabulary list"
              bytes={650_000}
              url="https://example.org/file.docx"
            />
          </OakUL>
          <OakFlex $justifyContent="flex-end">
            <OakPrimaryInvertedButton iconName="download" isTrailingIcon>
              Download worksheet
            </OakPrimaryInvertedButton>
          </OakFlex>
        </PupilLessonIntroInfoCard>

        <PupilLessonIntroInfoCard
          title="Equipment"
          iconName="equipment-required"
        >
          <OakP $font="body-1">Pen, exercise book, and ruler.</OakP>
        </PupilLessonIntroInfoCard>

        <PupilLessonIntroInfoCard
          title="Content guidance"
          iconName="content-guidance"
        >
          <OakP $font="body-1">Contains references to grief and loss.</OakP>
        </PupilLessonIntroInfoCard>

        <PupilLessonIntroInfoCard
          title="Supervision"
          iconName="supervision-level"
        >
          <OakP $font="body-1">Adult supervision recommended.</OakP>
        </PupilLessonIntroInfoCard>

        <PupilLessonIntroInfoCard title="Worksheet" iconName="worksheet-3">
          <OakP $font="body-1">Optional</OakP>
          <OakFlex $justifyContent="flex-end">
            <OakPrimaryInvertedButton iconName="download" isTrailingIcon>
              Download worksheet (PDF 1.4MB)
            </OakPrimaryInvertedButton>
          </OakFlex>
        </PupilLessonIntroInfoCard>
      </>
    ),
    licenceSlot: <PupilLessonIntroLicence isLegacyLicense={false} />,
    bottomNav: {
      proceedLabel: "I'm ready",
      onProceed: () => {},
    },
  },
};

export const Minimal: Story = {
  args: {
    phase: "secondary",
    readyToLearnSlot: <PupilLessonIntroReadyCard />,
    bottomNav: {
      proceedLabel: "Continue lesson",
      onProceed: () => {},
    },
  },
};
