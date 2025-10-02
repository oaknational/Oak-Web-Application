import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/dom";

import { CurricTimetablingNameView } from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

let mockSearchParams = new URLSearchParams("");
const mockReplace = jest.fn();

const defaultSearchParams = new URLSearchParams(
  "subject=maths&year=1&autumn=30&spring=30&summer=30",
);

const mockSearchParamsWithName = new URLSearchParams(
  "subject=maths&year=1&autumn=30&spring=30&summer=30&name=Test+Test",
);

jest.mock("next/navigation", () => ({
  usePathname: () => "/timetabling/name",
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => mockSearchParams,
}));

describe("CurricTimetablingNameView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("component renders with heading correctly", async () => {
    const { getByRole } = renderWithTheme(
      <CurricTimetablingNameView subjectPhaseSlug="maths-primary" />,
    );
    const headingElement = getByRole("heading", { level: 2 });
    expect(headingElement).toHaveTextContent("Name your timetable");
  });

  test("component renders next button correctly", async () => {
    const { getByRole } = renderWithTheme(
      <CurricTimetablingNameView subjectPhaseSlug="maths-primary" />,
    );

    const button = getByRole("link", { name: /Finish/i });
    expect(button).toBeInTheDocument();
  });

  test("the next button directs to correct page", async () => {
    mockSearchParams = mockSearchParamsWithName;
    const { getByRole, getByPlaceholderText } = renderWithTheme(
      <CurricTimetablingNameView subjectPhaseSlug="maths-primary" />,
    );

    const button = getByRole("link", { name: /Finish/i });

    expect(button).toHaveAttribute(
      "href",
      "units?autumn=30&name=Test+Test&spring=30&summer=30&year=1",
    );
    const input = getByPlaceholderText("Type school name");

    await userEvent.type(input, "Oak national");

    await waitFor(() => {
      const button = getByRole("link", { name: /Finish/i });

      expect(button).toHaveAttribute(
        "href",
        "units?autumn=30&name=Test+TestOak+national&spring=30&summer=30&year=1",
      );
    });
  });

  test("component renders previous button", async () => {
    const { getByRole } = renderWithTheme(
      <CurricTimetablingNameView subjectPhaseSlug="maths-primary" />,
    );

    const button = getByRole("link", { name: /Previous/i });
    expect(button).toBeInTheDocument();
  });

  test("inputting a name persists for previous button", async () => {
    mockSearchParams = mockSearchParamsWithName;
    const { getByRole, getByPlaceholderText } = renderWithTheme(
      <CurricTimetablingNameView subjectPhaseSlug="maths-primary" />,
    );

    const button = getByRole("link", { name: /Previous/i });
    const input = getByPlaceholderText("Type school name");

    userEvent.type(input, "Oak national");

    expect(button).toHaveAttribute(
      "href",
      "new?autumn=30&name=Test+Test&spring=30&summer=30&year=1",
    );
  });

  test("having name in params directs to correct prev page", async () => {
    mockSearchParams = mockSearchParamsWithName;
    const { getByRole } = renderWithTheme(
      <CurricTimetablingNameView subjectPhaseSlug="maths-primary" />,
    );

    const prevNameBtn = getByRole("link", { name: /Previous/i });

    expect(prevNameBtn).toHaveAttribute(
      "href",
      "new?autumn=30&name=Test+Test&spring=30&summer=30&year=1",
    );
  });

  test("having name in params directs to correct next page", async () => {
    mockSearchParams = mockSearchParamsWithName;
    const { getByRole } = renderWithTheme(
      <CurricTimetablingNameView subjectPhaseSlug="maths-primary" />,
    );

    const finishNameBtn = getByRole("link", { name: /Finish/i });

    expect(finishNameBtn).toHaveAttribute(
      "href",
      "units?autumn=30&name=Test+Test&spring=30&summer=30&year=1",
    );
  });

  test("having name in params shows correct input", async () => {
    mockSearchParams = mockSearchParamsWithName;
    const { getByPlaceholderText } = renderWithTheme(
      <CurricTimetablingNameView subjectPhaseSlug="maths-primary" />,
    );

    const inputField = getByPlaceholderText("Type school name");

    expect(inputField).toHaveValue("Test Test");
  });

  test("no input has correct parameters", async () => {
    mockSearchParams = defaultSearchParams;
    const { getByRole } = renderWithTheme(
      <CurricTimetablingNameView subjectPhaseSlug="maths-primary" />,
    );

    const finishNameBtn = getByRole("link", { name: /Finish/i });

    expect(finishNameBtn).toHaveAttribute(
      "href",
      "units?autumn=30&name=&spring=30&summer=30&year=1",
    );
  });
});
