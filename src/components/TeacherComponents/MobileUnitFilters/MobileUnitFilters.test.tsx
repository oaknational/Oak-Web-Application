import React from "react";
import { screen, within, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import MobileUnitFilters, { MobileUnitFiltersProps } from "./MobileUnitFilters";

import { TrackFns } from "@/context/Analytics/AnalyticsProvider";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const mockProps: MobileUnitFiltersProps = {
  numberOfUnits: 10,
  browseRefined: jest.fn() as TrackFns["browseRefined"],
  setSelectedThemeSlug: jest.fn(),
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

  it("renders filter button", () => {
    renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <MobileUnitFilters {...mockProps} />
      </OakThemeProvider>,
    );
    const filterToggle = screen.getByRole("button", { name: /filter/i });

    expect(filterToggle).toBeInTheDocument();
  });

  it("opens filter drawer component when filter button clicked", async () => {
    renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <MobileUnitFilters {...mockProps} />
      </OakThemeProvider>,
    );
    const filterToggle = screen.getByRole("button", { name: /filter/i });
    const user = userEvent.setup();

    expect(screen.queryByText(/Filters/i)).not.toBeInTheDocument();

    await user.click(filterToggle);

    const filterDrawer = screen.getByText(/Filters/i);

    expect(filterDrawer).toBeInTheDocument();
  });

  it("renders correct sized year group filters", async () => {
    renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <MobileUnitFilters {...mockProps} />
      </OakThemeProvider>,
    );

    const filterToggle = screen.getByRole("button", { name: /filter/i });
    const user = userEvent.setup();

    await user.click(filterToggle);

    const yearLegend = screen.getByRole("group", { name: /Year/i });
    const fieldset = yearLegend.closest("fieldset");
    const checkboxes = fieldset
      ? within(fieldset).queryAllByRole("checkbox")
      : [];

    expect(fieldset).toBeInTheDocument();
    expect(checkboxes.length).toBe(3);
  });

  it("renders correct sized category filters", async () => {
    renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <MobileUnitFilters {...mockProps} />
      </OakThemeProvider>,
    );

    const filterToggle = screen.getByRole("button", { name: /filter/i });
    const user = userEvent.setup();

    await user.click(filterToggle);

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

    const filterToggle = screen.getByRole("button", { name: /filter/i });
    const user = userEvent.setup();

    await user.click(filterToggle);

    const themeRadioButtons = screen.getAllByRole("radio");

    expect(themeRadioButtons.length).toBe(3);
  });

  it("renders submit button in the footer of component which closes filter drawer onClick", async () => {
    renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <MobileUnitFilters {...mockProps} />
      </OakThemeProvider>,
    );
    const filterToggle = screen.getByRole("button", { name: /filter/i });
    const user = userEvent.setup();

    await user.click(filterToggle);

    const submitButton = screen.getByRole("button", { name: /Show results/i });

    expect(submitButton).toBeInTheDocument();

    await user.click(submitButton);

    waitFor(() => {
      expect(submitButton).not.toBeInTheDocument();
      expect(screen.queryByText(/Filters/i)).not.toBeInTheDocument();
    });
  });

  it("filters are applied when selected", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <MobileUnitFilters {...mockProps} />
      </OakThemeProvider>,
    );

    const filterToggle = screen.getByRole("button", { name: /filter/i });
    await user.click(filterToggle);

    const yearCheckbox = screen.getByRole("checkbox", { name: /Year 1/i });
    const categoryCheckbox = screen.getByRole("checkbox", { name: /Maths/i });
    const themeRadio = screen.getByRole("radio", { name: /Theme 1/i });

    await fireEvent.click(yearCheckbox);
    await fireEvent.click(categoryCheckbox);
    await fireEvent.click(themeRadio);

    expect(yearCheckbox).toBeChecked();
    expect(categoryCheckbox).toBeChecked();
    expect(themeRadio).toBeChecked();
  });

  it("invokes browse refined analytics with the correct props", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <MobileUnitFilters {...mockProps} />
      </OakThemeProvider>,
    );

    const filterToggle = screen.getByRole("button", { name: /filter/i });
    await user.click(filterToggle);

    const yearCheckbox = screen.getByRole("checkbox", { name: /Year 1/i });
    const categoryCheckbox = screen.getByRole("checkbox", { name: /Maths/i });
    const themeRadio = screen.getByRole("radio", { name: /Theme 1/i });
    const submitButton = screen.getByRole("button", { name: /Show results/i });

    await fireEvent.click(yearCheckbox);
    await fireEvent.click(categoryCheckbox);
    await fireEvent.click(themeRadio);

    await user.click(submitButton);
    expect(mockProps.browseRefined).toHaveBeenCalledWith({
      platform: "owa",
      product: "teacher lesson resources",
      engagementIntent: "refine",
      componentType: "filter_link",
      eventVersion: "2.0.0",
      analyticsUseCase: "Teacher",
      filterValue: "show results button",
      filterType: "Subject filter",
      activeFilters: {
        content_types: "units",
        learning_themes: "theme1",
        categories: "maths",
        year: "year-1",
      },
    });
  });
});
