import { CurricTimetablingNewView } from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

let mockSearchParams = new URLSearchParams("");
const mockReplace = jest.fn();
const mockUseParams = jest.fn(() => ({ subjectPhaseSlug: "maths-primary" }));

jest.mock("next/navigation", () => ({
  usePathname: () => "/timetabling/new",
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => mockSearchParams,
  useParams: (...args: []) => mockUseParams(...args),
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
    mockSearchParams = new URLSearchParams("");
    const { getByRole } = renderWithTheme(<CurricTimetablingNewView />);
    const linkElement = getByRole("link");
    expect(linkElement).toHaveAttribute(
      "href",
      "name?autumn=30&spring=30&summer=30&year=1",
    );
  });

  test("renders three disabled number inputs with default value 30", () => {
    const { getAllByLabelText } = renderWithTheme(<CurricTimetablingNewView />);
    const inputs = getAllByLabelText("Number of lessons") as HTMLInputElement[];
    expect(inputs).toHaveLength(3);
    inputs.forEach((input) => {
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
});
