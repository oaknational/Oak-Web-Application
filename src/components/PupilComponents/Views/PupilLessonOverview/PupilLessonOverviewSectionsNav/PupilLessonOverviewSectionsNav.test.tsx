import userEvent from "@testing-library/user-event";

import { LessonOverviewSectionName } from "../lessonOverviewSections";

import { PupilLessonOverviewSectionsNav } from "./PupilLessonOverviewSectionsNav";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme", "router"]);

describe("PupilLessonOverviewSectionsNav", () => {
  it("renders nav items and calls the item handler", async () => {
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
