import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/react";

import subjectPhaseOptions from "../../browser-lib/fixtures/subjectPhaseOptions";

import SubjectPhasePicker from "./SubjectPhasePicker";

import renderWithTheme from "__tests__/__helpers__/renderWithTheme";

describe("Component - subject phase picker", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("user clicks a subject", async () => {
    const { getAllByText } = renderWithTheme(
      <SubjectPhasePicker {...subjectPhaseOptions} />
    );
    const buttons = getAllByText("English");
    expect(buttons).toHaveLength(2);
    const parent = buttons[0]?.closest("button");
    if (!buttons[0]) {
      throw new Error("No buttons found");
    } else {
      userEvent.click(buttons[0]);
      await waitFor(() =>
        expect(parent?.parentElement).toHaveClass("selected")
      );
    }
  });
});
