import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/dom";

import { CurricTimetablingNameView } from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

let mockParams = new URLSearchParams("");
let mockReplace = jest.fn();

const mockSearchParams = new URLSearchParams(
  "subject=maths&year=1&autumn=30&spring=30&summer=30",
);

jest.mock("next/navigation", () => ({
  usePathname: () => "/timetabling/name",
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => mockParams,
}));

describe("CurricTimetablingNewView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

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

  test("the next button directs to correct page with user input", async () => {
    mockReplace = jest.fn();
    mockParams = mockSearchParams;
    const { getByRole, getByPlaceholderText } = renderWithTheme(
      <CurricTimetablingNameView />,
    );
    const input = getByPlaceholderText("Type school name");

    await userEvent.type(input, "Oak national");

    await waitFor(() => {
      const button = getByRole("link", { name: /Finish/i });

      expect(button).toHaveAttribute(
        "href",
        "units?subject=maths&year=1&autumn=30&spring=30&summer=30&name=Oak+national",
      );
    });
  });

  test("component renders previous button", async () => {
    const { getByRole } = renderWithTheme(<CurricTimetablingNameView />);

    const button = getByRole("link", { name: /Previous/i });
    expect(button).toBeInTheDocument();
  });

  test("inputting a name persists for previous button", async () => {
    mockReplace = jest.fn();
    mockParams = mockSearchParams;
    const { getByRole, getByPlaceholderText } = renderWithTheme(
      <CurricTimetablingNameView />,
    );

    const button = getByRole("link", { name: /Previous/i });
    const input = getByPlaceholderText("Type school name");

    await userEvent.type(input, "Oak national");

    await waitFor(() => {
      expect(button).toHaveAttribute(
        "href",
        "new?subject=maths&year=1&autumn=30&spring=30&summer=30&name=Oak+national",
      );
    });
  });

  test("having name in params directs to correct prev page", async () => {
    mockReplace = jest.fn();
    const paramsWithName = mockSearchParams;
    paramsWithName.append("name", "Test Test");
    mockParams = paramsWithName;
    const { getByRole } = renderWithTheme(<CurricTimetablingNameView />);

    const prevNameBtn = getByRole("link", { name: /Previous/i });

    expect(prevNameBtn).toHaveAttribute(
      "href",
      "new?subject=maths&year=1&autumn=30&spring=30&summer=30&name=Test+Test",
    );
  });

  test("having name in params directs to correct next page", async () => {
    mockReplace = jest.fn();
    const paramsWithName = mockSearchParams;
    paramsWithName.append("name", "Test Test");
    mockParams = paramsWithName;
    const { getByRole } = renderWithTheme(<CurricTimetablingNameView />);

    const finishNameBtn = getByRole("link", { name: /Finish/i });

    expect(finishNameBtn).toHaveAttribute(
      "href",
      "units?subject=maths&year=1&autumn=30&spring=30&summer=30&name=Test+Test",
    );
  });

  test("having name in params shows correct input", async () => {
    mockReplace = jest.fn();
    const paramsWithName = mockSearchParams;
    paramsWithName.append("name", "Test Test");
    mockParams = paramsWithName;
    const { getByPlaceholderText } = renderWithTheme(
      <CurricTimetablingNameView />,
    );

    const inputField = getByPlaceholderText("Type school name");

    expect(inputField).toHaveValue("Test Test");
  });

  test("no input has correct parameters", async () => {
    mockParams = new URLSearchParams(
      "subject=maths&year=1&autumn=30&spring=30&summer=30",
    );
    const { getByRole } = renderWithTheme(<CurricTimetablingNameView />);

    const finishNameBtn = getByRole("link", { name: /Finish/i });

    expect(finishNameBtn).toHaveAttribute(
      "href",
      "units?subject=maths&year=1&autumn=30&spring=30&summer=30",
    );
  });
});
