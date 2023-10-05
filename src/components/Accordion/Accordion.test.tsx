import userEvent from "@testing-library/user-event";

import Accordion from "./Accordion";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import Card from "@/components/Card";
import { P } from "@/components/Typography";

describe("Accordion component", () => {
  test("component renders with correct title", () => {
    const { getByText } = renderWithTheme(
      <Accordion title={"Lessons in unit"}>
        <Card>
          <P>Test child</P>
        </Card>
      </Accordion>,
    );

    expect(getByText("Lessons in unit")).toBeInTheDocument();
  });

  test("child component to not be visible on unexpanded container", () => {
    const { getByTestId } = renderWithTheme(
      <Accordion title={"Lessons in unit"}>
        <Card data-testid={"test-child"}>
          <P>Test child</P>
        </Card>
      </Accordion>,
    );

    expect(getByTestId("test-child")).not.toBeVisible();
  });

  test("container expands on click, child component to become visible", async () => {
    const { getByTestId } = renderWithTheme(
      <Accordion title={"Lessons in unit"}>
        <Card data-testid={"test-child"}>
          <P>Test child</P>
        </Card>
      </Accordion>,
    );

    const button = getByTestId("expand-accordian-button");

    await userEvent.click(button);

    expect(getByTestId("test-child")).toBeVisible();
  });

  test("has aria-expanded changes from false to true when component is expanded", async () => {
    const { getByTestId } = renderWithTheme(
      <Accordion title={"Lessons in unit"}>
        <Card data-testid={"test-child"}>
          <P>Test child</P>
        </Card>
      </Accordion>,
    );

    const button = getByTestId("expand-accordian-button");

    expect(button).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  test("component renders child component", async () => {
    const { getByText, getByTestId } = renderWithTheme(
      <Accordion title={"Lessons in unit"}>
        <Card data-testid="test-child">
          <P>Test child</P>
        </Card>
      </Accordion>,
    );
    expect(getByTestId("test-child")).not.toBeVisible();

    const button = getByTestId("expand-accordian-button");
    await userEvent.click(button);

    expect(getByTestId("test-child")).toBeVisible();
    expect(getByText("Test child")).toBeInTheDocument();
  });
});
