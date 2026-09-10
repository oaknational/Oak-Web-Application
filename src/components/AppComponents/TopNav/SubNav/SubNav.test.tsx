import { screen } from "@testing-library/react";

import { DropdownFocusManager } from "../DropdownFocusManager/DropdownFocusManager";

import SubNav, { SubNavProps } from "./SubNav";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import {
  TeachersSubNavData,
  PupilsSubNavData,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

const render = renderWithProviders();

describe("SubNav (Teachers)", () => {
  const mockFocusManager = new DropdownFocusManager<TeachersSubNavData>(
    topNavFixture.teachers!,
    "teachers",
    () => undefined,
  );
  const mockOnClick = jest.fn();
  const mockIsMenuSelected = jest.fn().mockReturnValue(false);

  const defaultProps: SubNavProps<TeachersSubNavData> = {
    ...topNavFixture.teachers!,
    area: "teachers",
    onClick: mockOnClick,
    isMenuSelected: mockIsMenuSelected,
    focusManager: mockFocusManager,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders Ai experiments link as a link element with external icon", () => {
    render(<SubNav {...defaultProps} />);

    const aiExperimentsLink = screen.getByRole("link", {
      name: "Ai experiments (this will open in a new tab)",
    });

    expect(aiExperimentsLink).toBeInTheDocument();
    expect(aiExperimentsLink).toHaveAttribute(
      "href",
      "https://labs.thenational.academy",
    );
    expect(aiExperimentsLink).toHaveAttribute("target", "_blank");
  });

  it("renders Primary as a button", () => {
    render(<SubNav {...defaultProps} />);

    const primaryButton = screen.getByRole("button", { name: "Primary" });

    expect(primaryButton).toBeInTheDocument();
    expect(primaryButton).not.toHaveAttribute("href");
  });

  it("renders Secondary as a button", () => {
    render(<SubNav {...defaultProps} />);

    const secondaryButton = screen.getByRole("button", { name: "Secondary" });

    expect(secondaryButton).toBeInTheDocument();
    expect(secondaryButton).not.toHaveAttribute("href");
  });

  it("renders Guidance as a button", () => {
    render(<SubNav {...defaultProps} />);

    const guidanceButton = screen.getByRole("button", { name: "Guidance" });

    expect(guidanceButton).toBeInTheDocument();
    expect(guidanceButton).not.toHaveAttribute("href");
  });

  it("renders About us as a button", () => {
    render(<SubNav {...defaultProps} />);

    const aboutUsButton = screen.getByRole("button", { name: "About us" });

    expect(aboutUsButton).toBeInTheDocument();
    expect(aboutUsButton).not.toHaveAttribute("href");
  });
});

describe("SubNav (Pupils)", () => {
  const mockFocusManager = new DropdownFocusManager<PupilsSubNavData>(
    topNavFixture.pupils!,
    "pupils",
    () => undefined,
  );
  const mockOnClick = jest.fn();
  const mockIsMenuSelected = jest.fn().mockReturnValue(false);

  const defaultProps: SubNavProps<PupilsSubNavData> = {
    ...topNavFixture.pupils!,
    area: "pupils",
    onClick: mockOnClick,
    isMenuSelected: mockIsMenuSelected,
    focusManager: mockFocusManager,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders Primary as a button", () => {
    render(<SubNav {...defaultProps} />);

    const primaryButton = screen.getByRole("button", { name: "Primary" });

    expect(primaryButton).toBeInTheDocument();
    expect(primaryButton).not.toHaveAttribute("href");
  });

  it("renders Secondary as a button", () => {
    render(<SubNav {...defaultProps} />);

    const secondaryButton = screen.getByRole("button", { name: "Secondary" });

    expect(secondaryButton).toBeInTheDocument();
    expect(secondaryButton).not.toHaveAttribute("href");
  });

  it("renders Help link as a link element with external icon", () => {
    render(<SubNav {...defaultProps} />);

    const helpLink = screen.getByRole("link", {
      name: "Help (this will open in a new tab)",
    });

    expect(helpLink).toBeInTheDocument();
    expect(helpLink).toHaveAttribute(
      "href",
      "https://support.thenational.academy",
    );
    expect(helpLink).toHaveAttribute("target", "_blank");
  });
});
