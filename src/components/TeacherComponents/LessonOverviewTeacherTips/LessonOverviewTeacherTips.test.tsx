import { describe, expect, it } from "vitest";

import renderWithTheme from "../../../__tests__/__helpers__/renderWithTheme";

import LessonOverviewTeacherTips from "./LessonOverviewTeacherTips";

describe("LessonOverviewTeacherTips component", () => {
  const teacherTips = [{ teacherTip: "test teacher tip" }];
  it("should render with correct title", () => {
    const { getByTestId, getByText } = renderWithTheme(
      <LessonOverviewTeacherTips teacherTips={teacherTips} />,
    );
    const componentTitle = getByText("Teacher tip");
    expect(getByTestId("heading")).toBeInTheDocument();
    expect(componentTitle).toBeInTheDocument();
  });

  it("should render with teacherTip", () => {
    const { getByText } = renderWithTheme(
      <LessonOverviewTeacherTips teacherTips={teacherTips} />,
    );

    const tip = getByText("test teacher tip");
    expect(tip).toBeInTheDocument();
  });
});
