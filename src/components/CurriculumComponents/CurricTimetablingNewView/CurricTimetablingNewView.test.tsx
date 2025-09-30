import { fireEvent } from "@testing-library/react";

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

  test("renders three interactive number inputs with default value 30", () => {
    const { getAllByLabelText } = renderWithTheme(<CurricTimetablingNewView />);
    const inputs = getAllByLabelText("Number of lessons") as HTMLInputElement[];
    expect(inputs).toHaveLength(3);
    inputs.forEach((input) => {
      expect(input).not.toBeDisabled();
      expect(input).toHaveValue(30);
      expect(input).toHaveAttribute("type", "number");
      expect(input).toHaveAttribute("min", "5");
      expect(input).toHaveAttribute("max", "35");
    });
  });

  test("renders headings and inputs with correct IDs", () => {
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

    expect(inputs[0]).toHaveAttribute("id", "autumn-lessons");
    expect(inputs[1]).toHaveAttribute("id", "spring-lessons");
    expect(inputs[2]).toHaveAttribute("id", "summer-lessons");
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

  test("updates next button href when input values change", () => {
    mockParams = new URLSearchParams(
      "subject=maths&year=1&autumn=30&spring=30&summer=30",
    );
    const { getAllByLabelText, getByRole } = renderWithTheme(
      <CurricTimetablingNewView />,
    );
    const inputs = getAllByLabelText("Number of lessons") as HTMLInputElement[];
    const linkElement = getByRole("link");

    expect(inputs).toHaveLength(3);

    // Initial state
    expect(linkElement).toHaveAttribute(
      "href",
      "name?subject=maths&year=1&autumn=30&spring=30&summer=30",
    );

    // Change autumn lessons to 25
    fireEvent.change(inputs[0]!, { target: { value: "25" } });
    expect(linkElement).toHaveAttribute(
      "href",
      "name?subject=maths&year=1&autumn=25&spring=30&summer=30",
    );

    // Change spring lessons to 15
    fireEvent.change(inputs[1]!, { target: { value: "15" } });
    expect(linkElement).toHaveAttribute(
      "href",
      "name?subject=maths&year=1&autumn=25&spring=15&summer=30",
    );

    // Change summer lessons to 20
    fireEvent.change(inputs[2]!, { target: { value: "20" } });
    expect(linkElement).toHaveAttribute(
      "href",
      "name?subject=maths&year=1&autumn=25&spring=15&summer=20",
    );
  });

  test("initializes input values from URL params", () => {
    mockParams = new URLSearchParams(
      "subject=maths&year=1&autumn=20&spring=25&summer=35",
    );
    const { getAllByLabelText, getByRole } = renderWithTheme(
      <CurricTimetablingNewView />,
    );
    const inputs = getAllByLabelText("Number of lessons") as HTMLInputElement[];

    expect(inputs[0]).toHaveValue(20);
    expect(inputs[1]).toHaveValue(25);
    expect(inputs[2]).toHaveValue(35);

    const linkElement = getByRole("link");
    expect(linkElement).toHaveAttribute(
      "href",
      "name?subject=maths&year=1&autumn=20&spring=25&summer=35",
    );
  });
});
