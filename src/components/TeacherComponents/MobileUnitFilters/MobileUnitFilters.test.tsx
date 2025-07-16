import React from "react";
import { screen, within, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import MobileUnitFilters, { MobileUnitFiltersProps } from "./MobileUnitFilters";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const mockProps: MobileUnitFiltersProps = {
  numberOfUnits: 10,
  learningThemesFilterId: "theme1",
  yearGroups: [
    { yearTitle: "Year 1", yearSlug: "year-1", year: "1" },
    { yearTitle: "Year 2", yearSlug: "year-2", year: "2" },
  ],
  subjectCategories: [
    { slug: "maths", label: "Maths", iconName: "maths-icon" },
    { slug: "science", label: "Science", iconName: "science-icon" },
  ],
  learningThemes: [
    { themeSlug: "theme1", themeTitle: "Theme 1" },
    { themeSlug: "theme2", themeTitle: "Theme 2" },
  ],
  programmeSlug: "programme1",
  keyStageTitle: "Key Stage 1",
  keyStageSlug: "ks1",
  subjectTitle: "Maths",
  subjectSlug: "maths",
  pathwaySlug: null,
  units: [],
  examBoardSlug: "aqa",
  examBoardTitle: "AQA",
  subjectParent: "Maths",
  tierSlug: null,
  lessonCount: 20,
  tiers: [],
  hasNewContent: false,
  phase: "primary",
  pathwayTitle: null,
  updateActiveFilters: jest.fn(),
  isOpen: true,
  setIsOpen: jest.fn(),
  handleSubmitQuery: jest.fn(),
  incomingThemeSlug: "",
  incomingCategorySlug: "",
  incomingYearGroupSlug: "",
};

describe("MobileUnitFilters", () => {
  beforeAll(() => {
    global.IntersectionObserver = jest.fn(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
      root: null,
      rootMargin: "",
      thresholds: [],
      takeRecords: jest.fn(),
    }));
  });

  it("calls setIsOpen when the filter button is clicked", async () => {
    const mockSetIsOpen = jest.fn();
    renderWithTheme(
      <MobileUnitFilters
        {...mockProps}
        isOpen={false}
        setIsOpen={mockSetIsOpen}
      />,
    );

    const filterDrawerButton = screen.getByRole("button", { name: /Filter/i });
    expect(filterDrawerButton).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(filterDrawerButton);

    expect(mockSetIsOpen).toHaveBeenCalledWith(true);
  });

  it("calls setIsOpen with false when the close button is clicked", async () => {
    const mockSetIsOpen = jest.fn();
    renderWithTheme(
      <MobileUnitFilters {...mockProps} setIsOpen={mockSetIsOpen} />,
    );

    const closeButton = screen.getByRole("button", { name: /Close/i });
    expect(closeButton).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(closeButton);

    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  it("renders correct sized year group filters", async () => {
    renderWithTheme(<MobileUnitFilters {...mockProps} />);

    const yearLegend = screen.getByRole("group", { name: /Year/i });
    const fieldset = yearLegend.closest("fieldset");
    const checkboxes = fieldset
      ? within(fieldset).queryAllByRole("checkbox")
      : [];

    expect(fieldset).toBeInTheDocument();
    expect(checkboxes.length).toBe(3);
  });

  it("renders correct sized category filters", async () => {
    renderWithTheme(<MobileUnitFilters {...mockProps} />);

    const categoryLegend = screen.getByRole("group", { name: /Category/i });
    const fieldset = categoryLegend.closest("fieldset");
    const checkboxes = fieldset
      ? within(fieldset).queryAllByRole("checkbox")
      : [];

    expect(fieldset).toBeInTheDocument();
    expect(checkboxes.length).toBe(3);
  });

  it("renders correct sized theme radio button filters", async () => {
    renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <MobileUnitFilters {...mockProps} />
      </OakThemeProvider>,
    );

    const themeRadioButtons = screen.getAllByRole("radio");

    expect(themeRadioButtons.length).toBe(3);
  });

  it("renders submit button in the footer of component which closes filter drawer onClick", async () => {
    renderWithTheme(<MobileUnitFilters {...mockProps} />);

    const submitButton = screen.getByRole("button", { name: /Show results/i });

    expect(submitButton).toBeInTheDocument();

    const user = userEvent.setup();

    await user.click(submitButton);

    waitFor(() => {
      expect(submitButton).not.toBeInTheDocument();
      expect(screen.queryByText(/Filters/i)).not.toBeInTheDocument();
    });
  });

  it("calls updateActiveFilters when a filter is selected", async () => {
    const mockUpdateFilters = jest.fn();
    renderWithTheme(
      <MobileUnitFilters
        {...mockProps}
        updateActiveFilters={mockUpdateFilters}
      />,
    );

    const yearCheckbox = screen.getByRole("checkbox", { name: /Year 1/i });
    expect(yearCheckbox).toBeInTheDocument();
    fireEvent.click(yearCheckbox);
    expect(mockUpdateFilters).toHaveBeenCalledWith({ year: "year-1" });

    const categoryCheckbox = screen.getByRole("checkbox", { name: /Maths/i });
    expect(categoryCheckbox).toBeInTheDocument();
    fireEvent.click(categoryCheckbox);
    expect(mockUpdateFilters).toHaveBeenCalledWith({ category: "maths" });

    const themeRadio = screen.getByRole("radio", { name: /Theme 1/i });
    expect(themeRadio).toBeInTheDocument();
    fireEvent.click(themeRadio);
    expect(mockUpdateFilters).toHaveBeenCalledWith({ theme: "theme1" });
  });

  it("filters are applied when selected", async () => {
    renderWithTheme(
      <MobileUnitFilters
        {...mockProps}
        incomingCategorySlug="maths"
        incomingThemeSlug="theme1"
        incomingYearGroupSlug="year-1"
      />,
    );

    const yearCheckbox = screen.getByRole("checkbox", { name: /Year 1/i });
    const categoryCheckbox = screen.getByRole("checkbox", { name: /Maths/i });
    const themeRadio = screen.getByRole("radio", { name: /Theme 1/i });

    expect(yearCheckbox).toBeChecked();
    expect(categoryCheckbox).toBeChecked();
    expect(themeRadio).toBeChecked();
  });
});
