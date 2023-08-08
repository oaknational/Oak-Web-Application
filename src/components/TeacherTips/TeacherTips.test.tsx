import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import TeacherTips from "./TeacherTips";

describe("TeacherTips component", () => {
  const teacherTips = [{ teacherTip: "test teacher tip" }];
  it.only("should render with correct title", () => {
    const { getByTestId, getByText } = renderWithTheme(
      <TeacherTips teacherTips={teacherTips} />
    );
    const componentTitle = getByText("Teacher tip");
    expect(getByTestId("heading")).toBeInTheDocument();
    expect(componentTitle).toBeInTheDocument();
  });

  it("should render with teacherTip", () => {
    const { getByText } = renderWithTheme(
      <TeacherTips teacherTips={teacherTips} />
    );

    const tip = getByText("test teacher tip");
    expect(tip).toBeInTheDocument();
  });
});
