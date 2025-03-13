import userEvent from "@testing-library/user-event";
import { OakP } from "@oaknational/oak-components";

import CurriculumUnitDetailsAccordion from "./CurriculumUnitDetailsAccordion";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import Card from "@/components/SharedComponents/Card";

const unitOverviewExplored = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      unitOverviewExplored: (...args: unknown[]) =>
        unitOverviewExplored(...args),
    },
  }),
}));

const handleUnitOverviewExploredAnalytics = () => jest.fn();
describe("CurriculumUnitDetailsAccordion", () => {
  test("component renders with correct title", () => {
    const { getByText } = renderWithTheme(
      <CurriculumUnitDetailsAccordion
        handleUnitOverviewExploredAnalytics={
          handleUnitOverviewExploredAnalytics
        }
        title={"Lessons in unit"}
      >
        <Card>
          <OakP>Test child</OakP>
        </Card>
      </CurriculumUnitDetailsAccordion>,
    );

    expect(getByText("Lessons in unit")).toBeInTheDocument();
  });

  test("child component to not be visible on unexpanded container", () => {
    const { getByTestId } = renderWithTheme(
      <CurriculumUnitDetailsAccordion
        handleUnitOverviewExploredAnalytics={
          handleUnitOverviewExploredAnalytics
        }
        title={"Lessons in unit"}
      >
        <Card data-testid={"test-child"}>
          <OakP>Test child</OakP>
        </Card>
      </CurriculumUnitDetailsAccordion>,
    );

    expect(getByTestId("test-child")).not.toBeVisible();
  });

  test("container expands on click, child component to become visible", async () => {
    const { getByTestId } = renderWithTheme(
      <CurriculumUnitDetailsAccordion
        handleUnitOverviewExploredAnalytics={
          handleUnitOverviewExploredAnalytics
        }
        title={"Lessons in unit"}
      >
        <Card data-testid={"test-child"}>
          <OakP>Test child</OakP>
        </Card>
      </CurriculumUnitDetailsAccordion>,
    );

    const button = getByTestId("expand-accordian-button");

    await userEvent.click(button);

    expect(getByTestId("test-child")).toBeVisible();
  });

  test("has aria-expanded changes from false to true when component is expanded", async () => {
    const { getByTestId } = renderWithTheme(
      <CurriculumUnitDetailsAccordion
        handleUnitOverviewExploredAnalytics={
          handleUnitOverviewExploredAnalytics
        }
        title={"Lessons in unit"}
      >
        <Card data-testid={"test-child"}>
          <OakP>Test child</OakP>
        </Card>
      </CurriculumUnitDetailsAccordion>,
    );

    const button = getByTestId("expand-accordian-button");

    expect(button).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  test("component renders child component", async () => {
    const { getByText, getByTestId } = renderWithTheme(
      <CurriculumUnitDetailsAccordion
        handleUnitOverviewExploredAnalytics={
          handleUnitOverviewExploredAnalytics
        }
        title={"Lessons in unit"}
      >
        <Card data-testid="test-child">
          <OakP>Test child</OakP>
        </Card>
      </CurriculumUnitDetailsAccordion>,
    );
    expect(getByTestId("test-child")).not.toBeVisible();

    const button = getByTestId("expand-accordian-button");
    await userEvent.click(button);

    expect(getByTestId("test-child")).toBeVisible();
    expect(getByText("Test child")).toBeInTheDocument();
  });
});
