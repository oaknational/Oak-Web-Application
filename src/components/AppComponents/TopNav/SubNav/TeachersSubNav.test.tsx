import { screen } from "@testing-library/react";

import { DropdownFocusManager } from "../DropdownFocusManager/DropdownFocusManager";

import TeachersSubNav, { subNavButtons } from "./TeachersSubNav";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

const render = renderWithProviders();

describe("TeachersSubNav", () => {
  const mockFocusManager = new DropdownFocusManager(
    topNavFixture.teachers!,
    "teachers",
    subNavButtons,
    () => undefined,
  );
  const mockOnClick = jest.fn();
  const mockIsMenuSelected = jest.fn().mockReturnValue(false);

  const defaultProps = {
    onClick: mockOnClick,
    isMenuSelected: mockIsMenuSelected,
    focusManager: mockFocusManager,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the Curriculum link as a link element with correct href", () => {
    render(<TeachersSubNav {...defaultProps} />);

    const curriculumLink = screen.getByRole("link", { name: "Curriculum" });

    expect(curriculumLink).toBeInTheDocument();
    expect(curriculumLink).toHaveAttribute("href", "/teachers/curriculum");
  });

  it("renders Primary as a button", () => {
    render(<TeachersSubNav {...defaultProps} />);

    const primaryButton = screen.getByRole("button", { name: "Primary" });

    expect(primaryButton).toBeInTheDocument();
    expect(primaryButton).not.toHaveAttribute("href");
  });

  it("renders Secondary as a button", () => {
    render(<TeachersSubNav {...defaultProps} />);

    const secondaryButton = screen.getByRole("button", { name: "Secondary" });

    expect(secondaryButton).toBeInTheDocument();
    expect(secondaryButton).not.toHaveAttribute("href");
  });

  it("renders Guidance as a button", () => {
    render(<TeachersSubNav {...defaultProps} />);

    const guidanceButton = screen.getByRole("button", { name: "Guidance" });

    expect(guidanceButton).toBeInTheDocument();
    expect(guidanceButton).not.toHaveAttribute("href");
  });

  it("renders About us as a button", () => {
    render(<TeachersSubNav {...defaultProps} />);

    const aboutUsButton = screen.getByRole("button", { name: "About us" });

    expect(aboutUsButton).toBeInTheDocument();
    expect(aboutUsButton).not.toHaveAttribute("href");
  });
});
