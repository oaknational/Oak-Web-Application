import React from "react";
import { render } from "@testing-library/react";

import { GoogleClassroomSubjectIconHeader } from "./GoogleClassroomSubjectIconHeader";

jest.mock("@oaknational/oak-components", () => ({
  OakFlex: (props: { children?: React.ReactNode } & object) => {
    const { children, ...rest } = props;
    return (
      <div data-testid="oak-flex" data-props={JSON.stringify(rest)}>
        {children}
      </div>
    );
  },
}));

const subjectIconMock = jest.fn();

jest.mock("@/components/TeacherComponents/SubjectIconBrushBorders", () =>
  jest.fn((props) => {
    subjectIconMock(props);
    return <div data-testid="subject-icon" />;
  }),
);

describe("GoogleClassroomSubjectIconHeader", () => {
  beforeEach(() => jest.clearAllMocks());

  it("uses bg-decorative3-main when pageType is unit", () => {
    render(
      <GoogleClassroomSubjectIconHeader pageType="unit" subjectSlug="maths" />,
    );

    expect(subjectIconMock).toHaveBeenCalledWith(
      expect.objectContaining({
        subjectSlug: "maths",
        color: "bg-decorative3-main",
        isNew: false,
      }),
    );
  });

  it("uses bg-decorative4-main when pageType is lesson", () => {
    render(
      <GoogleClassroomSubjectIconHeader pageType="lesson" subjectSlug={null} />,
    );

    expect(subjectIconMock).toHaveBeenCalledWith(
      expect.objectContaining({
        subjectSlug: null,
        color: "bg-decorative4-main",
      }),
    );
  });
});
