import React from "react";
import { screen } from "@testing-library/react";

import { SaveUnitButton } from "./SaveUnitButton";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { TrackingProgrammeData } from "@/node-lib/educator-api/helpers/saveUnits/utils";

const render = renderWithProviders();

const mockTrackingProps: TrackingProgrammeData = {
  savedFrom: "unit_listing_save_button",
  keyStageSlug: "ks1",
  keyStageTitle: "Key stage 1",
  subjectSlug: "maths",
  subjectTitle: "Maths",
};

const defaultProps = {
  buttonVariant: "default" as const,
  programmeSlug: "programme-slug",
  unitSlug: "unit-slug",
  unitTitle: "Test unit",
  disabled: false,
  trackingProps: mockTrackingProps,
};

const mockIsUnitSaved = jest.fn().mockReturnValue(false);
const mockIsUnitSaving = jest.fn().mockReturnValue(false);
const mockSaveToggle = jest.fn();
jest.mock("@/node-lib/educator-api/helpers/saveUnits/useSaveUnits", () => {
  return {
    useSaveUnits: () => ({
      onSaveToggle: () => mockSaveToggle(),
      isUnitSaved: () => mockIsUnitSaved(),
      showSignIn: false,
      setShowSignIn: jest.fn(),
      isUnitSaving: () => mockIsUnitSaving(),
    }),
  };
});

describe("SaveUnitButton", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("renders correctly with default props", () => {
    render(<SaveUnitButton {...defaultProps} />);
    const button = screen.getByRole("button", {
      name: "Save this unit: Test unit",
    });

    expect(button).toBeInTheDocument();
  });
  it('renders correctly with "Saved" text when isSaved is true', () => {
    mockIsUnitSaved.mockReturnValue(true);
    render(<SaveUnitButton {...defaultProps} />);
    const button = screen.getByRole("button", {
      name: "Unsave this unit: Test unit",
    });

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Saved");
  });
  it('renders correctly with "Save" text when isSaved is false', () => {
    render(<SaveUnitButton {...defaultProps} />);
    const button = screen.getByRole("button", {
      name: "Save this unit: Test unit",
    });

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Save");
  });
  it("disables the button when disabled is true", () => {
    render(<SaveUnitButton {...defaultProps} disabled />);
    const button = screen.getByRole("button", {
      name: "Save this unit: Test unit",
    });
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toBeDisabled();
  });

  it("calls onSave when the button is clicked", () => {
    render(<SaveUnitButton {...defaultProps} />);
    const button = screen.getByRole("button", {
      name: "Save this unit: Test unit",
    });

    button.click();
    expect(mockSaveToggle).toHaveBeenCalled();
  });
});
