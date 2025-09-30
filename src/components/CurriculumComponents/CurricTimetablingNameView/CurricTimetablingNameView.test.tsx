import { CurricTimetablingNameView } from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

let mockSearchParams = new URLSearchParams("");
let mockReplace = jest.fn();
const mockUseParams = jest.fn(() => ({ subjectPhaseSlug: "maths-primary" }));

const defaultSearchParams = new URLSearchParams(
  "subject=maths&year=1&autumn=30&spring=30&summer=30",
);

jest.mock("next/navigation", () => ({
  usePathname: () => "/timetabling/name",
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => mockSearchParams,
  useParams: (...args: []) => mockUseParams(...args),
}));

describe("CurricTimetablingNameView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  test("the next button directs to correct page", async () => {
    mockReplace = jest.fn();
    mockSearchParams = defaultSearchParams;
    const { getByRole } = renderWithTheme(<CurricTimetablingNameView />);

    const button = getByRole("link", { name: /Finish/i });

    expect(button).toHaveAttribute(
      "href",
      "units?autumn=30&name=&spring=30&summer=30&year=1",
    );
  });

  test("component renders previous button", async () => {
    const { getByRole } = renderWithTheme(<CurricTimetablingNameView />);

    const button = getByRole("link", { name: /Previous/i });
    expect(button).toBeInTheDocument();
  });

  test("the previous button directs to correct page and name persists", async () => {
    mockReplace = jest.fn();
    mockSearchParams = defaultSearchParams;
    const { getByRole } = renderWithTheme(<CurricTimetablingNameView />);

    const button = getByRole("link", { name: /Previous/i });

    expect(button).toHaveAttribute(
      "href",
      "new?autumn=30&name=&spring=30&summer=30&year=1",
    );
  });

  test("having name in params directs to correct prev page", async () => {
    mockReplace = jest.fn();
    const paramsWithName = defaultSearchParams;
    paramsWithName.append("name", "Test Test");
    mockSearchParams = paramsWithName;
    const { getByRole } = renderWithTheme(<CurricTimetablingNameView />);

    const prevNameBtn = getByRole("link", { name: /Previous/i });

    expect(prevNameBtn).toHaveAttribute(
      "href",
      "new?autumn=30&name=Test+Test&spring=30&summer=30&year=1",
    );
  });

  test("having name in params directs to correct next page", async () => {
    mockReplace = jest.fn();
    const paramsWithName = defaultSearchParams;
    paramsWithName.append("name", "Test Test");
    mockSearchParams = paramsWithName;
    const { getByRole } = renderWithTheme(<CurricTimetablingNameView />);

    const finishNameBtn = getByRole("link", { name: /Finish/i });

    expect(finishNameBtn).toHaveAttribute(
      "href",
      "units?autumn=30&name=Test+Test&spring=30&summer=30&year=1",
    );
  });

  test("having name in params shows correct input", async () => {
    mockReplace = jest.fn();
    const paramsWithName = defaultSearchParams;
    paramsWithName.append("name", "Test Test");
    mockSearchParams = paramsWithName;
    const { getByPlaceholderText } = renderWithTheme(
      <CurricTimetablingNameView />,
    );

    const inputField = getByPlaceholderText("Type school name");

    expect(inputField).toHaveValue("Test Test");
  });
});
