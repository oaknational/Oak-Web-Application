import { CurricTimetableHeader } from "./CurricTimetableHeader";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("CurricTimetableHeader", () => {
  test("basic usage", () => {
    const { baseElement, getByTestId } = render(
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
