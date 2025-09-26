import { CurricTimetablingNameView } from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("CurricTimetablingNewView", () => {
  test("component renders next button correctly", async () => {
    const { getByRole } = renderWithTheme(<CurricTimetablingNameView />);

    const button = getByRole("link", { name: /Next/i });
    expect(button).toBeInTheDocument();
  });

  test("the next button directs to correct page", async () => {
    const { getByRole } = renderWithTheme(<CurricTimetablingNameView />);

    const button = getByRole("link", { name: /Next/i });

    expect(button).toHaveAttribute("href", "/timetabling/units");
  });

  test("component renders previous button", async () => {
    const { getByRole } = renderWithTheme(<CurricTimetablingNameView />);

    const button = getByRole("link", { name: /Previous/i });
    expect(button).toBeInTheDocument();
  });

  test("the previous button directs to correct page", async () => {
    const { getByRole } = renderWithTheme(<CurricTimetablingNameView />);

    const button = getByRole("link", { name: /Previous/i });

    expect(button).toHaveAttribute("href", "/timetabling/new");
  });
});
