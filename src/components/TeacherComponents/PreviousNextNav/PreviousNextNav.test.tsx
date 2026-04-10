import { screen } from "@testing-library/dom";

import PreviousNextNav from "./PreviousNextNav";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const render = renderWithTheme;

describe("PreviousNextNav", () => {
  it("renders previous and next units", () => {
    render(
      <PreviousNextNav
        navItemType="unit"
        backgroundColorLevel={3}
        previous={{ title: "Mock prev unit", href: "testUrl" }}
        next={{ title: "Mock next unit", href: "testUrl" }}
      />,
    );

    const previousUnitTitle = screen.getByText("Mock prev unit");
    expect(previousUnitTitle).toBeInTheDocument();
    const previousUnitText = screen.getByText("Previous unit");
    expect(previousUnitText).toBeInTheDocument();

    const nextUnitTitle = screen.getByText("Mock next unit");
    expect(nextUnitTitle).toBeInTheDocument();
    const nextUnitText = screen.getByText("Next unit");
    expect(nextUnitText).toBeInTheDocument();
  });
  it("renders previous and next lessons", () => {
    render(
      <PreviousNextNav
        navItemType="lesson"
        backgroundColorLevel={3}
        previous={{ title: "Mock prev lesson", href: "testUrl" }}
        next={{ title: "Mock next lesson", href: "testUrl" }}
      />,
    );

    const previouslessonTitle = screen.getByText("Mock prev lesson");
    expect(previouslessonTitle).toBeInTheDocument();
    const previouslessonText = screen.getByText("Previous lesson");
    expect(previouslessonText).toBeInTheDocument();

    const nextlessonTitle = screen.getByText("Mock next lesson");
    expect(nextlessonTitle).toBeInTheDocument();
    const nextlessonText = screen.getByText("Next lesson");
    expect(nextlessonText).toBeInTheDocument();
  });
  it("renders index for previous nav item", () => {
    render(
      <PreviousNextNav
        navItemType="lesson"
        backgroundColorLevel={3}
        currentIndex={3}
        previous={{ title: "Mock prev lesson", href: "testUrl" }}
      />,
    );

    const previousIndex = screen.getByTestId("nav-item-index");
    expect(previousIndex).toHaveTextContent("2");
  });
  it("renders index for next nav item", () => {
    render(
      <PreviousNextNav
        navItemType="lesson"
        backgroundColorLevel={3}
        currentIndex={3}
        next={{ title: "Mock next lesson", href: "testUrl" }}
      />,
    );

    const previousIndex = screen.getByTestId("nav-item-index");
    expect(previousIndex).toHaveTextContent("4");
  });
});
