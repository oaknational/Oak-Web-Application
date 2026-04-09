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
    const previousUnitLink = screen.getByRole("link", {
      name: "Previous unit",
    });
    expect(previousUnitLink).toBeInTheDocument();

    const nextUnitTitle = screen.getByText("Mock next unit");
    expect(nextUnitTitle).toBeInTheDocument();
    const nextUnitLink = screen.getByRole("link", { name: "Next unit" });
    expect(nextUnitLink).toBeInTheDocument();
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
    const previouslessonLink = screen.getByRole("link", {
      name: "Previous lesson",
    });
    expect(previouslessonLink).toBeInTheDocument();

    const nextlessonTitle = screen.getByText("Mock next lesson");
    expect(nextlessonTitle).toBeInTheDocument();
    const nextlessonLink = screen.getByRole("link", { name: "Next lesson" });
    expect(nextlessonLink).toBeInTheDocument();
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
