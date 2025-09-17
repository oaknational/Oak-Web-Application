import { CurricTimetablingNewView } from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("CurricTimetablingNewView", () => {
  test("component renders with heading correctly", async () => {
    const { getByRole } = renderWithTheme(<CurricTimetablingNewView />);
    const headingElement = getByRole("heading", { level: 1 });
    expect(headingElement).toHaveTextContent("New timetable form");
  });

  test("component renders with button correctly", async () => {
    const { getByRole } = renderWithTheme(<CurricTimetablingNewView />);

    const linkElement = getByRole("link");
    expect(linkElement).toHaveTextContent("Next");
  });

  test("the next button directs to correct page", async () => {
    const { getByRole } = renderWithTheme(<CurricTimetablingNewView />);

    const linkElement = getByRole("link");
    expect(linkElement).toHaveAttribute("href", "/timetabling/name");
  });
});
