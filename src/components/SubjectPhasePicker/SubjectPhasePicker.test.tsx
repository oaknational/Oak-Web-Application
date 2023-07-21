import userEvent from "@testing-library/user-event";

import subjectPhaseOptions from "../../browser-lib/fixtures/subjectPhaseOptions";

import SubjectPhasePicker from "./SubjectPhasePicker";

import renderWithTheme from "__tests__/__helpers__/renderWithTheme";

describe("Component - subject phase picker", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders a heading", () => {
    const { getByText } = renderWithTheme(
      <SubjectPhasePicker {...subjectPhaseOptions} />
    );
    const heading = getByText("Title");
    expect(heading).toBeInTheDocument();
  });

  test("user clicks a subject"),
    () => {
      const { getByText } = renderWithTheme(
        <SubjectPhasePicker {...subjectPhaseOptions} />
      );
      const button = getByText("English");
      expect(button).toBeInTheDocument();
      userEvent.click(button);
      // expect(button).toHaveClass("active");
    };
});
