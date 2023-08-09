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

  test("user clicks new and old subjects, then deselects", async () => {
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
    userEvent.click(oldButton);
    await waitFor(() => {
      expect(control).toHaveTextContent("Science");
    });
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

  test("user selects then deselects primary", async () => {
    const { getByTitle, findByTitle, queryByTitle } = renderWithTheme(
      <SubjectPhasePicker {...subjectPhaseOptions} />
    );
    const control = getByTitle("Phase");
    userEvent.click(control);
    await userEvent.click(await findByTitle("Primary"));
    expect(control).toHaveTextContent("Primary");
    expect(await queryByTitle("Exam board")).toBeNull();
    await userEvent.click(control);
    await userEvent.click(await findByTitle("Primary"));
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
    const control = await getByTitle("Phase");
    userEvent.click(await findByTitle("Secondary"));
    const examboardTitle = await findByText("Exam board");
    expect(examboardTitle).toBeTruthy();
    await userEvent.click(getByTitle("AQA"));
    expect(control).toHaveTextContent("Secondary, AQA");
  });

  test("user can close selection panels on outside click", async () => {
    const { findByText, getByTitle, queryByText } = renderWithTheme(
      <SubjectPhasePicker {...subjectPhaseOptions} />
    );
    await userEvent.click(getByTitle("Subject"));
    expect(await findByText("Latest Resources")).toBeTruthy();
    await userEvent.click(document.body);
    expect(queryByText("Latest Resources")).toBeNull();
    await userEvent.click(getByTitle("Phase"));
    expect(await findByText("Choose a school phase:")).toBeTruthy();
    await userEvent.click(document.body);
    expect(queryByText("Choose a school phase:")).toBeNull();
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
