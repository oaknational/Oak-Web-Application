import { screen } from "@testing-library/dom";

import TeacherTipBox from "./TeacherTipBox";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import { getOakUiColor } from "@/__tests__/__helpers__/getOakUiColor";

const render = renderWithProvidersByName([
  "theme",
  "oakTheme",
  "analytics",
  "teacherBrowseAnalytics",
]);

describe("TeacherTipBox", () => {
  it("renders teacher tip", () => {
    render(
      <TeacherTipBox
        tips={[
          "Allow pupils to sensibly and kindly trigger a reflex response to allow pupils to realise that the response happens before they know about it.",
        ]}
      />,
    );

    const teacherTipHeading = screen.getByRole("heading", {
      name: "Teacher tip",
    });
    const teacherTipContainer = screen.getByTestId("teacher-tip-container");
    const teacherTipText = screen.getByText(
      "Allow pupils to sensibly and kindly trigger a reflex response to allow pupils to realise that the response happens before they know about it.",
    );
    expect(teacherTipHeading).toBeInTheDocument();
    expect(teacherTipText).toBeInTheDocument();
    expect(teacherTipContainer).toHaveStyle({
      background: getOakUiColor("bg-decorative2-subdued"),
    });
  });

  it("renders every tip", () => {
    render(<TeacherTipBox tips={["Tip 1", "Tip 2", "Tip 3"]} />);

    expect(screen.getByText("Tip 1")).toBeInTheDocument();
    expect(screen.getByText("Tip 2")).toBeInTheDocument();
    expect(screen.getByText("Tip 3")).toBeInTheDocument();
  });
});
