import React from "react";
import "@testing-library/jest-dom";

import CurriculumUnitCard from "../CurricUnitCard";

import { CurricYearCard } from "./index";

import { createUnit } from "@/fixtures/curriculum/unit";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("CurricYearCard component", () => {
  const defaultProps = {
    yearTitle: "Year 7",
    isExamboard: false,
    children: <div>Test content</div>,
  };

  it("should render with year heading", () => {
    const { getByTestId } = renderWithTheme(
      <CurricYearCard {...defaultProps} />,
    );

    const yearHeading = getByTestId("year-heading");

    expect(yearHeading).toBeInTheDocument();
    expect(yearHeading).toHaveTextContent("Year 7");
  });

  it("should render correctly with heading and subheading", () => {
    const { getByTestId } = renderWithTheme(
      <CurricYearCard
        yearTitle="Year 11"
        yearSubheading="Core"
        isExamboard={false}
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
      <CurricYearCard {...defaultProps} />,
    );

    const yearSubheading = queryByTestId("year-subheading");

    expect(yearSubheading).not.toBeInTheDocument();
  });

  it("should apply pink50 background when isExamboard is true", () => {
    const { container } = renderWithTheme(
      <CurricYearCard {...defaultProps} isExamboard={true} />,
    );

    const box = container.querySelector(".mobileYearDisplay");

    expect(box).toHaveStyle({ background: "rgb(229, 209, 224)" });
  });

  it("should apply pink30 background when isExamboard is false", () => {
    const { container } = renderWithTheme(
      <CurricYearCard {...defaultProps} isExamboard={false} />,
    );

    const box = container.querySelector(".mobileYearDisplay");

    expect(box).toHaveStyle({ background: "rgb(245, 233, 242)" });
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
      <CurricYearCard
        yearTitle="Year 11"
        yearSubheading="Physics"
        isExamboard={true}
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
});
