import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";

import CurriculumUnitDetailsAccordion from "./CurriculumUnitDetailsAccordion";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import Card from "@/components/SharedComponents/Card";
import { P } from "@/components/SharedComponents/Typography";

describe("CurriculumUnitDetailsAccordion", () => {
  it("component renders with correct title", () => {
    const { getByText } = renderWithTheme(
      <CurriculumUnitDetailsAccordion title={"Lessons in unit"}>
        <Card>
          <P>Test child</P>
        </Card>
      </CurriculumUnitDetailsAccordion>,
    );

    expect(getByText("Lessons in unit")).toBeInTheDocument();
  });

  it("child component to not be visible on unexpanded container", () => {
    const { getByTestId } = renderWithTheme(
      <CurriculumUnitDetailsAccordion title={"Lessons in unit"}>
        <Card data-testid={"test-child"}>
          <P>Test child</P>
        </Card>
      </CurriculumUnitDetailsAccordion>,
    );

    expect(getByTestId("test-child")).not.toBeVisible();
  });

  it("container expands on click, child component to become visible", async () => {
    const { getByTestId } = renderWithTheme(
      <CurriculumUnitDetailsAccordion title={"Lessons in unit"}>
        <Card data-testid={"test-child"}>
          <P>Test child</P>
        </Card>
      </CurriculumUnitDetailsAccordion>,
    );

    const button = getByTestId("expand-accordian-button");

    await userEvent.click(button);

    expect(getByTestId("test-child")).toBeVisible();
  });

  it("has aria-expanded changes from false to true when component is expanded", async () => {
    const { getByTestId } = renderWithTheme(
      <CurriculumUnitDetailsAccordion title={"Lessons in unit"}>
        <Card data-testid={"test-child"}>
          <P>Test child</P>
        </Card>
      </CurriculumUnitDetailsAccordion>,
    );

    const button = getByTestId("expand-accordian-button");

    expect(button).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("component renders child component", async () => {
    const { getByText, getByTestId } = renderWithTheme(
      <CurriculumUnitDetailsAccordion title={"Lessons in unit"}>
        <Card data-testid="test-child">
          <P>Test child</P>
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
