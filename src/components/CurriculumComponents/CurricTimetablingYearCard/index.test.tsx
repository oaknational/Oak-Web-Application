import React from "react";
import "@testing-library/jest-dom";

import CurriculumUnitCard from "../CurricUnitCard";

import { CurricTimetablingYearCard } from "./index";

import { createUnit } from "@/fixtures/curriculum/unit";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const mockFeatureFlagEnabled = jest.fn().mockReturnValue(false);
jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => mockFeatureFlagEnabled(),
}));

describe("CurricTimetablingYearCard component", () => {
  const defaultProps = {
    yearTitle: "Year 7",
    children: <div>Test content</div>,
  };

  it("should render with year heading", () => {
    const { getByTestId } = renderWithTheme(
      <CurricTimetablingYearCard {...defaultProps} />,
    );

    const yearHeading = getByTestId("year-heading");

    expect(yearHeading).toBeInTheDocument();
    expect(yearHeading).toHaveTextContent("Year 7");
  });

  it("should render correctly with heading and subheading", () => {
    const { getByTestId } = renderWithTheme(
      <CurricTimetablingYearCard
        yearTitle="Year 11"
        yearSubheading="Core"
        children={<div>Content for Year 11 Mathematics</div>}
      />,
    );

    const yearHeading = getByTestId("year-heading");
    const yearSubheading = getByTestId("year-subheading");

    expect(yearHeading).toHaveTextContent("Year 11");
    expect(yearSubheading).toHaveTextContent("Core");
  });

  it("should not render year subheading when not provided", () => {
    const { queryByTestId } = renderWithTheme(
      <CurricTimetablingYearCard {...defaultProps} />,
    );

    const yearSubheading = queryByTestId("year-subheading");

    expect(yearSubheading).not.toBeInTheDocument();
  });

  it("should render units passed as children", () => {
    const unit1 = createUnit({
      title: "Mechanics",
      year: "11",
      subject: "Physics",
      subject_slug: "physics",
    });

    const unit2 = createUnit({
      title: "Waves and Electricity",
      year: "11",
      subject: "Physics",
      subject_slug: "physics",
    });

    const unit3 = createUnit({
      title: "Quantum Physics",
      year: "11",
      subject: "Physics",
      subject_slug: "physics",
    });

    const units = (
      <>
        <CurriculumUnitCard
          unit={unit1}
          index={0}
          isHighlighted={false}
          href={""}
        />
        <CurriculumUnitCard
          unit={unit2}
          index={1}
          isHighlighted={false}
          href={""}
        />
        <CurriculumUnitCard
          unit={unit3}
          index={2}
          isHighlighted={false}
          href={""}
        />
      </>
    );

    const { getByTestId, getAllByTestId } = renderWithTheme(
      <CurricTimetablingYearCard
        yearTitle="Year 11"
        yearSubheading="Physics"
        children={units}
      />,
    );

    const yearHeading = getByTestId("year-heading");
    const yearSubheading = getByTestId("year-subheading");

    expect(yearHeading).toHaveTextContent("Year 11");
    expect(yearSubheading).toHaveTextContent("Physics");

    const unitCards = getAllByTestId("unit-card");
    expect(unitCards).toHaveLength(3);

    expect(unitCards[0]).toHaveTextContent("Mechanics");
    expect(unitCards[1]).toHaveTextContent("Waves and Electricity");
    expect(unitCards[2]).toHaveTextContent("Quantum Physics");
  });

  it("should render the map to timetable link if feature flag is enabled ", () => {
    mockFeatureFlagEnabled.mockReturnValue(true);
    const { container } = renderWithTheme(
      <CurricTimetablingYearCard
        {...defaultProps}
        timetablingUrl={"/timetabling/maths-primary/new?year=7"}
      />,
    );

    expect(container).toHaveTextContent("Map to school timetable");
  });

  it("should not render the map to timetable link if feature flag is not enabled ", () => {
    mockFeatureFlagEnabled.mockReturnValue(false);
    const { container } = renderWithTheme(
      <CurricTimetablingYearCard {...defaultProps} />,
    );

    expect(container).not.toHaveTextContent("Map to school timetable");
  });

  it("should have the correct href for the map to timetable link", () => {
    mockFeatureFlagEnabled.mockReturnValue(true);
    const { getByRole } = renderWithTheme(
      <CurricTimetablingYearCard
        {...defaultProps}
        timetablingUrl={"/timetabling/maths-primary/new?year=7"}
      />,
    );

    const link = getByRole("link");

    expect(link).toHaveAttribute(
      "href",
      "/timetabling/maths-primary/new?year=7",
    );
  });
});
