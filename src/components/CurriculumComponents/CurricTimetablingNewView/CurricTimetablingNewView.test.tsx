import { CurricTimetablingNewView } from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

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
    const { getByRole } = renderWithTheme(<CurricTimetablingNewView />);

    const linkElement = getByRole("link");
    expect(linkElement).toHaveAttribute("href", "/timetabling/name");
  });

  test("renders three disabled number inputs with default value 10", () => {
    const { getAllByLabelText } = renderWithTheme(<CurricTimetablingNewView />);
    const inputs = getAllByLabelText("Number of lessons") as HTMLInputElement[];
    expect(inputs).toHaveLength(3);
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
      expect(input).toHaveValue("10");
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
