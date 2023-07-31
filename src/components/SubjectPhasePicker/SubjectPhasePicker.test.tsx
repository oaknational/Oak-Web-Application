import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/react";

import subjectPhaseOptions from "../../browser-lib/fixtures/subjectPhaseOptions";

import SubjectPhasePicker from "./SubjectPhasePicker";

import renderWithTheme from "__tests__/__helpers__/renderWithTheme";

describe("Component - subject phase picker", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("user can see subjects when they click the control", async () => {
    const { getByTitle, findAllByTitle } = renderWithTheme(
      <SubjectPhasePicker {...subjectPhaseOptions} />
    );
    const control = getByTitle("Subject");
    expect(control).toBeTruthy();
    userEvent.click(control);
    const buttons = await findAllByTitle("English");
    expect(buttons).toHaveLength(2);
  });

  test("user clicks new and old subjects", async () => {
    const { getByTitle, findAllByTitle } = renderWithTheme(
      <SubjectPhasePicker {...subjectPhaseOptions} />
    );
    const control = getByTitle("Subject");
    userEvent.click(control);
    const buttons = await findAllByTitle("Science");
    const newButton = buttons[0];
    if (!newButton) {
      throw new Error("New button not found");
    }
    userEvent.click(newButton);
    await waitFor(() => {
      expect(control).toHaveTextContent("Science (new)");
    });
    const oldButton = buttons[1];
    if (!oldButton) {
      throw new Error("Old button not found");
    }
    userEvent.click(oldButton);
    await waitFor(() => {
      expect(control).toHaveTextContent("Science");
    });
  });

  test("user clicks to open phases when they click the control", async () => {
    const { getByTitle } = renderWithTheme(
      <SubjectPhasePicker {...subjectPhaseOptions} />
    );
    const control = getByTitle("Phase");
    expect(control).toBeTruthy();
    userEvent.click(control);
    await waitFor(() => {
      const button = getByTitle("Primary");
      expect(button).toBeTruthy();
    });
  });

  test("user clicks primary then secondary", async () => {
    const { getByTitle, findByTitle, queryByTitle } = renderWithTheme(
      <SubjectPhasePicker {...subjectPhaseOptions} />
    );
    const control = getByTitle("Phase");
    userEvent.click(control);
    const button = await findByTitle("Primary");
    await userEvent.click(button);
    expect(control).toHaveTextContent("Primary");
    expect(await queryByTitle("Exam board")).toBeNull();
  });

  test("user clicks English, secondary and an exam board", async () => {
    const { findByText, findByTitle, getByTitle, findAllByTitle } =
      renderWithTheme(<SubjectPhasePicker {...subjectPhaseOptions} />);
    userEvent.click(getByTitle("Subject"));
    const button = (await findAllByTitle("English"))[0];
    if (!button) {
      throw new Error("Expected 2 buttons");
    }
    userEvent.click(button);
    const control = await getByTitle("Phase");
    userEvent.click(await findByTitle("Secondary"));
    const examboardTitle = await findByText("Exam board");
    expect(examboardTitle).toBeTruthy();
    await userEvent.click(getByTitle("AQA"));
    expect(control).toHaveTextContent("Secondary, AQA");
  });

  test("user clicks View without selection and gets error", async () => {
    const { findByText, getByText } = renderWithTheme(
      <SubjectPhasePicker {...subjectPhaseOptions} />
    );
    userEvent.click(getByText("View"));
    const subjectError = await findByText("Please select a subject");
    const phaseError = await findByText("Please select a phase");
    expect(subjectError).toBeTruthy();
    expect(phaseError).toBeTruthy();
  });
});
