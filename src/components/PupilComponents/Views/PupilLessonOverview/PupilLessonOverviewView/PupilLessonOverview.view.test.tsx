import userEvent from "@testing-library/user-event";

import { LessonOverviewSectionName } from "../lessonOverviewSections";

import { PupilLessonOverviewView } from "./PupilLessonOverview.view";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme", "router"]);

describe("PupilLessonOverviewView", () => {
  it("renders slots and calls the proceed handler", async () => {
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
});
