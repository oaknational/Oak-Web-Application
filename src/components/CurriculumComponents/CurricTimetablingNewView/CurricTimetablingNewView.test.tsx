import { fireEvent } from "@testing-library/react";

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
    const { getByRole } = renderWithTheme(
      <CurricTimetablingNewView subjectPhaseSlug="maths-primary" />,
    );
    const headingElement = getByRole("heading", { level: 2 });
    expect(headingElement).toHaveTextContent("Enter lessons per term");
  });

  test("component renders with button correctly", async () => {
    const { getByRole } = renderWithTheme(
      <CurricTimetablingNewView subjectPhaseSlug="maths-primary" />,
    );

    const linkElement = getByRole("link");
    expect(linkElement).toHaveTextContent("Next");
  });

  test("the next button directs to correct page", async () => {
    mockSearchParams = new URLSearchParams("");
    const { getByRole } = renderWithTheme(
      <CurricTimetablingNewView subjectPhaseSlug="maths-primary" />,
    );
    const linkElement = getByRole("link");
    expect(linkElement).toHaveAttribute(
      "href",
      "name?autumn=30&spring=30&summer=30&year=1",
    );
  });

  test("renders three interactive number inputs with default value 30", () => {
    const { getAllByLabelText } = renderWithTheme(
      <CurricTimetablingNewView subjectPhaseSlug="maths-primary" />,
    );
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

  test("associates headings to inputs via aria-describedby", () => {
    const { getAllByLabelText, getByText } = renderWithTheme(
      <CurricTimetablingNewView subjectPhaseSlug="maths-primary" />,
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

  test("renders headings and inputs with correct IDs", () => {
    const { getAllByLabelText, getByText } = renderWithTheme(
      <CurricTimetablingNewView subjectPhaseSlug="maths-primary" />,
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

  test("updates next button href when input values change", () => {
    mockSearchParams = new URLSearchParams("");
    const { getAllByLabelText, getByRole } = renderWithTheme(
      <CurricTimetablingNewView subjectPhaseSlug="maths-primary" />,
    );
    const inputs = getAllByLabelText("Number of lessons") as HTMLInputElement[];
    const linkElement = getByRole("link");

    expect(inputs).toHaveLength(3);

    // Initial state
    expect(linkElement).toHaveAttribute(
      "href",
      "name?autumn=30&spring=30&summer=30&year=1",
    );

    // Change autumn lessons to 25
    fireEvent.change(inputs[0]!, { target: { value: "25" } });
    expect(linkElement).toHaveAttribute(
      "href",
      "name?autumn=25&spring=30&summer=30&year=1",
    );

    // Change spring lessons to 15
    fireEvent.change(inputs[1]!, { target: { value: "15" } });
    expect(linkElement).toHaveAttribute(
      "href",
      "name?autumn=25&spring=15&summer=30&year=1",
    );

    // Change summer lessons to 20
    fireEvent.change(inputs[2]!, { target: { value: "20" } });
    expect(linkElement).toHaveAttribute(
      "href",
      "name?autumn=25&spring=15&summer=20&year=1",
    );
  });

  test("initializes input values from URL params", () => {
    mockSearchParams = new URLSearchParams("autumn=20&spring=25&summer=35");
    const { getAllByLabelText, getByRole } = renderWithTheme(
      <CurricTimetablingNewView subjectPhaseSlug="maths-primary" />,
    );
    const inputs = getAllByLabelText("Number of lessons") as HTMLInputElement[];

    expect(inputs[0]).toHaveValue(20);
    expect(inputs[1]).toHaveValue(25);
    expect(inputs[2]).toHaveValue(35);

    const linkElement = getByRole("link");
    expect(linkElement).toHaveAttribute(
      "href",
      "name?autumn=20&spring=25&summer=35&year=1",
    );
  });
});
