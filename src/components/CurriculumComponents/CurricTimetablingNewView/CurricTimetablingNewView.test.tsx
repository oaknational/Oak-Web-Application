import { CurricTimetablingNewView } from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

let mockParams = new URLSearchParams("");
let mockReplace = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => "/timetabling/new",
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => mockParams,
}));

describe("CurricTimetablingNewView", () => {
  test("component renders with heading correctly", async () => {
    const { getByRole } = renderWithTheme(<CurricTimetablingNewView />);
    const headingElement = getByRole("heading", { level: 2 });
    expect(headingElement).toHaveTextContent("Enter lessons per term");
  });

  test("component renders with button correctly", async () => {
    const { getByRole } = renderWithTheme(<CurricTimetablingNewView />);

    const linkElement = getByRole("link");
    expect(linkElement).toHaveTextContent("Next");
  });

  test("the next button directs to correct page", async () => {
    mockParams = new URLSearchParams("");
    const { getByRole } = renderWithTheme(<CurricTimetablingNewView />);
    const linkElement = getByRole("link");
    expect(linkElement).toHaveAttribute(
      "href",
      "name?subject=maths&year=1&autumn=30&spring=30&summer=30",
    );
  });

  test("renders three disabled number inputs with default value 30", () => {
    const { getAllByLabelText } = renderWithTheme(<CurricTimetablingNewView />);
    const inputs = getAllByLabelText("Number of lessons") as HTMLInputElement[];
    expect(inputs).toHaveLength(3);
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
      expect(input).toHaveValue("30");
    });
  });

  test("associates headings to inputs via aria-describedby", () => {
    const { getAllByLabelText, getByText } = renderWithTheme(
      <CurricTimetablingNewView />,
    );
    const inputs = getAllByLabelText("Number of lessons") as HTMLInputElement[];

    const autumn = getByText("Autumn");
    const spring = getByText("Spring");
    const summer = getByText("Summer");

    expect(autumn.id).toBe("autumn-heading");
    expect(spring.id).toBe("spring-heading");
    expect(summer.id).toBe("summer-heading");

    expect(inputs[0]).toHaveAttribute("aria-describedby", autumn.id);
    expect(inputs[1]).toHaveAttribute("aria-describedby", spring.id);
    expect(inputs[2]).toHaveAttribute("aria-describedby", summer.id);
  });

  test("normalises URL with defaults when missing", () => {
    mockReplace = jest.fn();
    mockParams = new URLSearchParams("");
    const { unmount } = renderWithTheme(<CurricTimetablingNewView />);
    expect(mockReplace).toHaveBeenCalledWith(
      "/timetabling/new?subject=maths&year=1&autumn=30&spring=30&summer=30",
    );
    unmount();
  });

  test("fills missing terms, preserves allowed keys, drops others", () => {
    mockReplace = jest.fn();
    mockParams = new URLSearchParams(
      "subject=science&year=2&spring=10&foo=bar",
    );
    const { unmount, getByRole } = renderWithTheme(
      <CurricTimetablingNewView />,
    );
    expect(mockReplace).toHaveBeenCalledWith(
      "/timetabling/new?subject=science&year=2&autumn=30&spring=10&summer=30",
    );
    const linkElement = getByRole("link");
    expect(linkElement).toHaveAttribute(
      "href",
      "name?subject=science&year=2&autumn=30&spring=10&summer=30",
    );
    unmount();
  });

  test("does not replace query params when already correct", () => {
    mockReplace = jest.fn();
    mockParams = new URLSearchParams(
      "subject=maths&year=1&autumn=30&spring=30&summer=30",
    );
    const { unmount } = renderWithTheme(<CurricTimetablingNewView />);
    expect(mockReplace).not.toHaveBeenCalled();
    unmount();
  });
});
