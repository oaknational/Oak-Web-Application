import { CurricTimetableHeader } from "./CurricTimetableHeader";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("CurricTimetableHeader", () => {
  test("basic usage", () => {
    const { baseElement, getByTestId } = renderWithTheme(
      <CurricTimetableHeader
        titleSlot={"TITLE"}
        additionalSlot={"ADDITIONAL"}
        illustrationSlug={"magic-carpet"}
      />,
    );
    expect(baseElement).toMatchSnapshot();
    expect(getByTestId("timetable-header-title")).toHaveTextContent("TITLE");
    expect(getByTestId("timetable-header-additional")).toHaveTextContent(
      "ADDITIONAL",
    );
  });
});
