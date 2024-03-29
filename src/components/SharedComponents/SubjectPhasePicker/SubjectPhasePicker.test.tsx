import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/react";

import subjectPhaseOptions from "@/browser-lib/fixtures/subjectPhaseOptions";
import SubjectPhasePicker from "@/components/SharedComponents/SubjectPhasePicker";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

const curriculumVisualiserAccessed = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      curriculumVisualiserAccessed: (...args: unknown[]) =>
        curriculumVisualiserAccessed(...args),
    },
  }),
}));

describe("Component - subject phase picker", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("populates selection if supplied", () => {
    const currentSelection = {
      subject: {
        title: "English",
        slug: "english",
        phases: [],
        examboards: [],
      },
      phase: { title: "Secondary", slug: "secondary" },
      examboard: { title: "AQA", slug: "aqa" },
    };
    const { getByTitle } = render(
      <SubjectPhasePicker
        {...subjectPhaseOptions}
        currentSelection={currentSelection}
      />,
    );
    const subjectControl = getByTitle("Subject");
    const phaseControl = getByTitle("Phase");
    expect(subjectControl).toHaveTextContent("English");
    expect(phaseControl).toHaveTextContent("Secondary");
    expect(phaseControl).toHaveTextContent("AQA");
  });

  test("user can see subjects when they click the control", async () => {
    const { getByTitle, findAllByTitle } = render(
      <SubjectPhasePicker {...subjectPhaseOptions} />,
    );
    const control = getByTitle("Subject");
    expect(control).toBeTruthy();
    await userEvent.click(control);
    const buttons = await findAllByTitle("English");
    expect(buttons).toHaveLength(1);
  });

  test("user selects a subject", async () => {
    const { getByTitle, findAllByTitle } = render(
      <SubjectPhasePicker {...subjectPhaseOptions} />,
    );
    const control = getByTitle("Subject");
    await userEvent.click(control);
    const buttons = await findAllByTitle("Science");
    const button = buttons[0];
    if (!button) {
      throw new Error("Button not found");
    }
    await userEvent.click(button);
    await waitFor(() => {
      expect(control).toHaveTextContent("Science");
    });
  });

  test("user clicks to open phases when they click the control", async () => {
    const { findByTitle, getByTitle } = render(
      <SubjectPhasePicker {...subjectPhaseOptions} />,
    );
    const control = getByTitle("Phase");
    expect(control).toBeTruthy();
    await userEvent.click(control);
    const button = await findByTitle("Primary");
    expect(button).toBeInTheDocument();
  });

  test("user selects primary and then Music", async () => {
    const { getByTitle, findByTitle, findAllByTitle, queryByTitle } = render(
      <SubjectPhasePicker {...subjectPhaseOptions} />,
    );
    const control = getByTitle("Phase");
    await userEvent.click(control);
    await userEvent.click(await findByTitle("Primary"));
    expect(control).toHaveTextContent("Primary");
    expect(queryByTitle("Exam board")).toBeNull();
    await userEvent.click(getByTitle("Subject"));
    const button = (await findAllByTitle("Music"))[0];
    if (!button) {
      throw new Error("Could not find button");
    }
    await userEvent.click(button);
    expect(control).toHaveTextContent("Select");
  });

  test("user clicks English, secondary and an exam board", async () => {
    const { findByText, findByTitle, getByTitle, findAllByTitle } = render(
      <SubjectPhasePicker {...subjectPhaseOptions} />,
    );
    await userEvent.click(getByTitle("Subject"));
    const button = (await findAllByTitle("English"))[0];
    if (!button) {
      throw new Error("Could not find button");
    }
    await userEvent.click(button);
    const control = getByTitle("Phase");
    await userEvent.click(await findByTitle("Secondary"));
    const examboardTitle = await findByText("Choose an exam board for KS4:");
    expect(examboardTitle).toBeTruthy();
    const aqa = (await findAllByTitle("AQA"))[0];
    if (!aqa) {
      throw new Error("Could not find button");
    }
    await userEvent.click(aqa);
    expect(control).toHaveTextContent("Secondary, AQA");
  });

  test("user can close selection panels with escape button", async () => {
    const { getByTestId } = render(
      <SubjectPhasePicker {...subjectPhaseOptions} />,
    );

    // Open the subject dropdown
    await userEvent.click(getByTestId("selectSubjectHeading"));
    const curriculumHeadingElem = getByTestId("subjectDropdownHeading");
    expect(curriculumHeadingElem).toBeVisible();
    await userEvent.keyboard("{Escape}");
    expect(curriculumHeadingElem).not.toBeVisible();

    // Open the phase dropdown
    await userEvent.click(getByTestId("selectPhaseHeading"));
    const schoolPhaseHeadingElem = getByTestId("phaseDropdownHeading");
    expect(schoolPhaseHeadingElem).toBeVisible();
    await userEvent.keyboard("{Escape}");
    expect(schoolPhaseHeadingElem).not.toBeVisible();
  });

  test("user clicks View without complete selection and gets error", async () => {
    const { getByText, getAllByTitle, getByTitle, queryByText } = render(
      <SubjectPhasePicker {...subjectPhaseOptions} />,
    );
    const viewButton = getByText("View");
    await userEvent.click(viewButton);
    expect(queryByText("Select a subject")).toBeTruthy();
    expect(queryByText("Select a school phase")).toBeTruthy();
    const subjectButtons = getAllByTitle("History");
    const historyButton = subjectButtons[0];
    if (!historyButton) {
      throw new Error("History button not found");
    }
    await userEvent.click(historyButton);
    await userEvent.click(document.body);
    await userEvent.click(viewButton);
    expect(queryByText("Select a subject")).toBeNull();
    expect(queryByText("Select a school phase")).toBeTruthy();
    await userEvent.click(getByTitle("Secondary"));
    await userEvent.click(document.body);
    await userEvent.click(viewButton);
    expect(queryByText("Select an exam board option")).toBeTruthy();
  });

  test("calls tracking.curriculumVisualiserAccessed once, with correct props", async () => {
    const { findAllByTitle, getByTitle, findByTitle, getByText } = render(
      <SubjectPhasePicker {...subjectPhaseOptions} />,
    );
    await userEvent.click(getByTitle("Subject"));
    const button = (await findAllByTitle("English"))[0];
    if (!button) {
      throw new Error("Could not find button");
    }
    await userEvent.click(button);

    await userEvent.click(await findByTitle("Primary"));

    const viewButton = getByText("View");
    await userEvent.click(viewButton);

    expect(curriculumVisualiserAccessed).toHaveBeenCalledTimes(1);
    expect(curriculumVisualiserAccessed).toHaveBeenCalledWith({
      subjectTitle: "English",
      subjectSlug: "english",
      phase: "primary",
      analyticsUseCase: null,
    });
  });

  test("User can navigate to previous curriculum plans", async () => {
    const { getByTestId, getByTitle } = render(
      <SubjectPhasePicker {...subjectPhaseOptions} />,
    );
    await userEvent.click(getByTitle("Subject"));
    const link = getByTestId("previousPlansLink");
    expect(link).toHaveAttribute(
      "href",
      "/teachers/curriculum/previous-downloads",
    );
  });
});
