import userEvent from "@testing-library/user-event";

import {
  LessonOverviewSectionName,
  PupilLessonOverviewContentGuidance,
  PupilLessonOverviewHeader,
  PupilLessonOverviewOutcomes,
  PupilLessonOverviewSectionsNav,
  PupilLessonOverviewView,
} from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme", "router"]);

describe("PupilLessonOverview", () => {
  it("renders the overview layout slots and proceed button", async () => {
    const onProceed = jest.fn();
    const user = userEvent.setup();

    render(
      <PupilLessonOverviewView
        phase="primary"
        backButtonSlot={<a href="/back">Back</a>}
        bannerSlot={<div>Banner</div>}
        header={{
          lessonTitle: "Introduction to poetry",
          yearDescription: "Year 5",
          subject: "English",
          subjectSlug: "english",
          phase: "primary",
        }}
        outcomesSlot={<div>Outcome slot</div>}
        contentGuidanceSlot={<div>Guidance slot</div>}
        sectionsNav={{
          items: [
            {
              section: LessonOverviewSectionName.Intro,
              href: "/intro",
              progress: "not-started",
              isLoading: false,
              onClick: () => undefined,
            },
          ],
        }}
        bottomNav={{ proceedLabel: "Continue", onProceed }}
      />,
    );

    expect(document.body).toHaveTextContent("Introduction to poetry");
    expect(document.body).toHaveTextContent("Back");
    expect(document.body).toHaveTextContent("Banner");
    expect(document.body).toHaveTextContent("Outcome slot");
    expect(document.body).toHaveTextContent("Guidance slot");

    await user.click(
      document.querySelector(
        '[data-testid="proceed-to-next-section"]',
      ) as HTMLElement,
    );

    expect(onProceed).toHaveBeenCalledTimes(1);
  });

  it("formats and renders content guidance when guidance exists", () => {
    render(
      <PupilLessonOverviewContentGuidance
        contentGuidance={[
          {
            contentguidanceLabel: "Scenes of conflict",
            contentguidanceDescription: null,
            contentguidanceArea: null,
          },
          {
            contentguidanceLabel: "Threat",
            contentguidanceDescription: null,
            contentguidanceArea: null,
          },
        ]}
        supervisionLevel="Adult supervision recommended"
      />,
    );

    expect(document.body).toHaveTextContent("Content guidance");
    expect(document.body).toHaveTextContent(
      "Scenes of conflict. Threat. Adult supervision recommended.",
    );
  });

  it("does not render content guidance or outcomes when there is no content", () => {
    const { container: guidanceContainer } = render(
      <PupilLessonOverviewContentGuidance contentGuidance={[]} />,
    );
    const { container: outcomesContainer } = render(
      <PupilLessonOverviewOutcomes outcomes={[]} />,
    );

    expect(guidanceContainer).toBeEmptyDOMElement();
    expect(outcomesContainer).toBeEmptyDOMElement();
  });

  it("renders the header metadata and outcomes list", () => {
    render(
      <>
        <PupilLessonOverviewHeader
          lessonTitle="Rivers and coasts"
          yearDescription="Year 7"
          subject="Geography"
          subjectSlug="geography"
          phase="secondary"
        />
        <PupilLessonOverviewOutcomes
          outcomes={["I can explain erosion", "I can compare coastlines"]}
        />
      </>,
    );

    expect(document.body).toHaveTextContent("Rivers and coasts");
    expect(document.body).toHaveTextContent("Year 7");
    expect(document.body).toHaveTextContent("Geography");
    expect(document.body).toHaveTextContent("Lesson outcome");
    expect(document.body).toHaveTextContent("I can explain erosion");
    expect(document.body).toHaveTextContent("I can compare coastlines");
  });

  it("renders section navigation items and calls the item handler", async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();

    render(
      <PupilLessonOverviewSectionsNav
        items={[
          {
            section: LessonOverviewSectionName.StarterQuiz,
            href: "/starter-quiz",
            progress: "in-progress",
            isLoading: false,
            numQuestions: 4,
            onClick,
          },
        ]}
      />,
    );

    await user.click(
      document.querySelector('[data-testid="starter-quiz"]') as HTMLElement,
    );

    expect(document.body).toHaveTextContent("Starter quiz");
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
