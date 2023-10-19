import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/react";

import subjectPhaseOptions from "@/browser-lib/fixtures/subjectPhaseOptions";
import SubjectPhasePicker from "@/components/SubjectPhasePicker";
// import render from "@/__tests__/__helpers__/render";
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
    userEvent.click(control);
    const buttons = await findAllByTitle("English");
    expect(buttons).toHaveLength(1);
  });

  test("user selects a subject", async () => {
    const { getByTitle, findAllByTitle } = render(
      <SubjectPhasePicker {...subjectPhaseOptions} />,
    );
    const control = getByTitle("Subject");
    userEvent.click(control);
    const buttons = await findAllByTitle("Science");
    const button = buttons[0];
    if (!button) {
      throw new Error("Button not found");
    }
    userEvent.click(button);
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
    userEvent.click(control);
    const button = await findByTitle("Primary");
    expect(button).toBeInTheDocument();
  });

  test("user selects primary and then Music", async () => {
    const { getByTitle, findByTitle, findAllByTitle, queryByTitle } = render(
      <SubjectPhasePicker {...subjectPhaseOptions} />,
    );
    const control = getByTitle("Phase");
    userEvent.click(control);
    await userEvent.click(await findByTitle("Primary"));
    expect(control).toHaveTextContent("Primary");
    expect(queryByTitle("Exam board")).toBeNull();
    userEvent.click(getByTitle("Subject"));
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
    userEvent.click(getByTitle("Subject"));
    const button = (await findAllByTitle("English"))[0];
    if (!button) {
      throw new Error("Could not find button");
    }
    userEvent.click(button);
    const control = getByTitle("Phase");
    userEvent.click(await findByTitle("Secondary"));
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
    const { getByTitle, queryByText } = render(
      <SubjectPhasePicker {...subjectPhaseOptions} />,
    );
    await userEvent.click(getByTitle("Subject"));
    expect(queryByText("New curriculum plans")).toBeTruthy();
    await userEvent.keyboard("{Escape}");
    expect(queryByText("New curriculum plans")).toBeNull();
    await userEvent.click(getByTitle("Phase"));
    expect(queryByText("Choose a school phase:")).toBeTruthy();
    await userEvent.keyboard("{Escape}");
    expect(queryByText("Choose a school phase:")).toBeNull();
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
    userEvent.click(getByTitle("Secondary"));
    await userEvent.click(document.body);
    await userEvent.click(viewButton);
    expect(queryByText("Select an exam board option")).toBeTruthy();
  });
});
