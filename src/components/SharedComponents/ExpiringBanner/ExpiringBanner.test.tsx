import { ExpiringBanner } from "./ExpiringBanner";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const render = renderWithTheme;

describe("ExpiringBanner", () => {
  const defaultProps = {
    isOpen: true,
    isResourcesMessage: false,
    onwardHref: "/new-lessons",
    onClose: jest.fn(),
    onViewNewLessons: jest.fn(),
  };

  it("should render the banner when isOpen is true", () => {
    const screen = render(<ExpiringBanner {...defaultProps} />);
    expect(
      screen.getByText("We've made brand-new and improved lessons for you."),
    ).toBeInTheDocument();
  });

  it("should not render the banner when isOpen is false", () => {
    const screen = render(<ExpiringBanner {...defaultProps} isOpen={false} />);
    expect(
      screen.queryByText("We've made brand-new and improved lessons for you."),
    ).not.toBeVisible();
  });

  it("should display the correct title for resources message", () => {
    const screen = render(
      <ExpiringBanner {...defaultProps} isResourcesMessage={true} />,
    );
    expect(
      screen.getByText(
        "These resources will be removed by end of Summer Term 2025.",
      ),
    ).toBeInTheDocument();
  });

  it("should display the correct title for lessons message", () => {
    const screen = render(
      <ExpiringBanner {...defaultProps} isResourcesMessage={false} />,
    );
    expect(
      screen.getByText(
        "These lessons will be removed by end of Summer Term 2025.",
      ),
    ).toBeInTheDocument();
  });

  it("should call onViewNewLessons when the View new lessons button is clicked", () => {
    const screen = render(<ExpiringBanner {...defaultProps} />);
    screen.getByRole("link", { name: /view new lessons/i }).click();
    expect(defaultProps.onViewNewLessons).toHaveBeenCalled();
  });

  it("should render the singular title when isSingular is true", () => {
    const screen = render(
      <ExpiringBanner {...defaultProps} isSingular={true} />,
    );
    expect(
      screen.getByText(
        "This lesson will be removed by end of Summer Term 2025.",
      ),
    ).toBeInTheDocument();
  });
});
