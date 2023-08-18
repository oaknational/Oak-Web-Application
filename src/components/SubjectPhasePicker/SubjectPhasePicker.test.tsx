import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/react";

import subjectPhaseOptions from "@/browser-lib/fixtures/subjectPhaseOptions";
import SubjectPhasePicker from "@/components/SubjectPhasePicker";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("Component - subject phase picker", () => {
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

  test("user selects a new subject", async () => {
    const { getByTitle, findAllByTitle } = renderWithTheme(
      <SubjectPhasePicker {...subjectPhaseOptions} />
    );
    const control = getByTitle("Subject");
    userEvent.click(control);
    const buttons = await findAllByTitle("Science");
    const button = buttons[0];
    if (!button) {
      throw new Error("New button not found");
    }
    userEvent.click(button);
    await waitFor(() => {
      expect(control).toHaveTextContent("Science (new)");
    });
  });

  test("user selects an old subject", async () => {
    const { getByTitle, findByTitle } = renderWithTheme(
      <SubjectPhasePicker {...subjectPhaseOptions} />
    );
    const control = getByTitle("Subject");
    userEvent.click(control);
    await userEvent.click(await findByTitle("Citizenship"));
    expect(control).toHaveTextContent("Citizenship");
  });

  test("user clicks to open phases when they click the control", async () => {
    const { findByTitle, getByTitle } = renderWithTheme(
      <SubjectPhasePicker {...subjectPhaseOptions} />
    );
    const control = getByTitle("Phase");
    expect(control).toBeTruthy();
    userEvent.click(control);
    const button = await findByTitle("Primary");
    expect(button).toBeInTheDocument();
  });

  test("user selects primary and then Music", async () => {
    const { getByTitle, findByTitle, findAllByTitle, queryByTitle } =
      renderWithTheme(<SubjectPhasePicker {...subjectPhaseOptions} />);
    const control = getByTitle("Phase");
    userEvent.click(control);
    await userEvent.click(await findByTitle("Primary"));
    expect(control).toHaveTextContent("Primary");
    expect(queryByTitle("Exam board")).toBeNull();
    userEvent.click(getByTitle("Subject"));
    const button = (await findAllByTitle("Music"))[0];
    if (!button) {
      throw new Error("Expected 2 buttons");
    }
    await userEvent.click(button);
    expect(control).toHaveTextContent("Select");
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
    const control = getByTitle("Phase");
    userEvent.click(await findByTitle("Secondary"));
    const examboardTitle = await findByText("Exam board");
    expect(examboardTitle).toBeTruthy();
    await userEvent.click(getByTitle("AQA"));
    expect(control).toHaveTextContent("Secondary, AQA");
  });

  test("user can close selection panels with escape button", async () => {
    const { getByTitle, queryByText } = renderWithTheme(
      <SubjectPhasePicker {...subjectPhaseOptions} />
    );
    await userEvent.click(getByTitle("Subject"));
    expect(queryByText("Latest Resources")).toBeTruthy();
    await userEvent.keyboard("{Escape}");
    expect(queryByText("Latest Resources")).toBeNull();
    await userEvent.click(getByTitle("Phase"));
    expect(queryByText("Choose a school phase:")).toBeTruthy();
    await userEvent.keyboard("{Escape}");
    expect(queryByText("Choose a school phase:")).toBeNull();
  });

  test("user clicks View without complete selection and gets error", async () => {
    const { getByText, getAllByTitle, getByTitle, queryByText } =
      renderWithTheme(<SubjectPhasePicker {...subjectPhaseOptions} />);
    const viewButton = getByText("View");
    await userEvent.click(viewButton);
    expect(queryByText("Please select a subject")).toBeTruthy();
    expect(queryByText("Please select a phase")).toBeTruthy();
    const subjectButtons = getAllByTitle("History");
    const historyButton = subjectButtons[0];
    if (!historyButton) {
      throw new Error("History button not found");
    }
    userEvent.click(historyButton);
    await userEvent.click(document.body);
    await userEvent.click(viewButton);
    expect(queryByText("Please select a subject")).toBeNull();
    expect(queryByText("Please select a phase")).toBeTruthy();
    userEvent.click(getByTitle("Secondary"));
    await userEvent.click(document.body);
    await userEvent.click(viewButton);
    expect(queryByText("Select an exam board")).toBeTruthy();
  });
});
