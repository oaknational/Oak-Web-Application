import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/react";

import subjectPhaseOptions from "../../browser-lib/fixtures/subjectPhaseOptions";

import SubjectPhasePicker from "./SubjectPhasePicker";

import renderWithTheme from "__tests__/__helpers__/renderWithTheme";

describe("Component - subject phase picker", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("user clicks to open subjects and sees subjects", async () => {
    const { getByTitle, getAllByTitle } = renderWithTheme(
      <SubjectPhasePicker {...subjectPhaseOptions} />
    );
    const control = getByTitle("Subject");
    expect(control).toBeTruthy();
    userEvent.click(control);
    await waitFor(() => {
      const buttons = getAllByTitle("English");
      expect(buttons).toHaveLength(2);
    });
  });

  test("user clicks to open phases and sees phases", async () => {
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
});
