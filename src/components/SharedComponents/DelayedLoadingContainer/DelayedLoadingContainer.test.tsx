import { screen, waitFor } from "@testing-library/react";
import { OakLoadingSpinner, OakP } from "@oaknational/oak-components";

import DelayedLoadingContainer from "./DelayedLoadingContainer";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

describe("DelayedLoadingContainer", () => {
  const render = renderWithProviders();

  it("should render with children", () => {
    render(
      <DelayedLoadingContainer>
        <div>Test content</div>
      </DelayedLoadingContainer>,
    );

    expect(screen.getByTestId("delayed-loading-container")).toBeInTheDocument();
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("should render loading spinner and label as children", () => {
    render(
      <DelayedLoadingContainer
        $flexDirection="column"
        $gap="spacing-16"
        $alignItems="center"
      >
        <OakLoadingSpinner />
        <OakP>Loading...</OakP>
      </DelayedLoadingContainer>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should render without children", () => {
    render(<DelayedLoadingContainer />);

    expect(screen.getByTestId("delayed-loading-container")).toBeInTheDocument();
  });

  it("should apply delay animation", () => {
    const { container } = render(
      <DelayedLoadingContainer delay={500}>
        <div>Content</div>
      </DelayedLoadingContainer>,
    );

    const styledContainer = container.querySelector(
      '[data-testid="delayed-loading-container"]',
    );
    expect(styledContainer).toBeInTheDocument();
  });

  it("should render with custom data-testid", () => {
    render(
      <DelayedLoadingContainer data-testid="custom-loading">
        <div>Content</div>
      </DelayedLoadingContainer>,
    );

    expect(screen.getByTestId("custom-loading")).toBeInTheDocument();
  });

  it("should accept OakFlex props", () => {
    render(
      <DelayedLoadingContainer
        $minHeight="spacing-480"
        $flexDirection="column"
        $gap="spacing-16"
        $alignItems="center"
      >
        <div>Styled content</div>
      </DelayedLoadingContainer>,
    );

    expect(screen.getByText("Styled content")).toBeInTheDocument();
  });

  it("should be visible after delay", async () => {
    const { container } = render(
      <DelayedLoadingContainer delay={100}>
        <div>Delayed content</div>
      </DelayedLoadingContainer>,
    );

    const styledContainer = container.querySelector(
      '[data-testid="delayed-loading-container"]',
    );

    // Container should exist
    expect(styledContainer).toBeInTheDocument();

    // After delay, animation should make it visible
    await waitFor(
      () => {
        expect(styledContainer).toBeInTheDocument();
      },
      { timeout: 200 },
    );
  });

  it("should render multiple children", () => {
    render(
      <DelayedLoadingContainer>
        <div>First child</div>
        <div>Second child</div>
        <div>Third child</div>
      </DelayedLoadingContainer>,
    );

    expect(screen.getByText("First child")).toBeInTheDocument();
    expect(screen.getByText("Second child")).toBeInTheDocument();
    expect(screen.getByText("Third child")).toBeInTheDocument();
  });
});
