import { CurricTimetablingNameView } from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const mockParams = new URLSearchParams("");
const mockReplace = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => "/timetabling/name",
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => mockParams,
}));

describe("CurricTimetablingNewView", () => {
  test("component renders with heading correctly", async () => {
    const { getByRole } = renderWithTheme(<CurricTimetablingNameView />);
    const headingElement = getByRole("heading", { level: 2 });
    expect(headingElement).toHaveTextContent("Name your timetable");
  });

  test("component renders next button correctly", async () => {
    const { getByRole } = renderWithTheme(<CurricTimetablingNameView />);

    const button = getByRole("link", { name: /Finish/i });
    expect(button).toBeInTheDocument();
  });

  test("the next button directs to correct page", async () => {
    const { getByRole } = renderWithTheme(<CurricTimetablingNameView />);

    const button = getByRole("link", { name: /Finish/i });

    expect(button).toHaveAttribute(
      "href",
      "units?subject=maths&year=1&autumn=30&spring=30&summer=30&name=Oak+National+Academy",
    );
  });

  test("component renders previous button", async () => {
    const { getByRole } = renderWithTheme(<CurricTimetablingNameView />);

    const button = getByRole("link", { name: /Previous/i });
    expect(button).toBeInTheDocument();
  });

  test("the previous button directs to correct page and name persists", async () => {
    const { getByRole } = renderWithTheme(<CurricTimetablingNameView />);

    const button = getByRole("link", { name: /Previous/i });

    expect(button).toHaveAttribute(
      "href",
      "new?subject=maths&year=1&autumn=30&spring=30&summer=30&name=Oak+National+Academy",
    );
  });
});
