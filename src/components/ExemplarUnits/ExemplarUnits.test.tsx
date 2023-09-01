import { screen } from "@testing-library/react";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";
import { UnitListItemProps } from "../UnitAndLessonLists/UnitList/UnitListItem/UnitListItem";

import { ExemplarUnitsProps } from "./ExemplarUnits";

import ExemplarUnits from ".";

import unitListingFixture from "@/node-lib/curriculum-api/fixtures/unitListing.fixture";

const units = unitListingFixture()
  .units.slice(0, 10)
  .map((unit) => unit[0]) as unknown as UnitListItemProps[];

export const exemplarUnitsProps: ExemplarUnitsProps = {
  heading: "Secondary units",
  subHeading: "View and download our early-release units.",
  color: "lavender50",
  quote: {
    text: "A life saver… I didn’t think you could beat the previous Oak resources.",
    author: "— Sophie Baker",
    occupation: "Class Teacher, St Agnes Academy",
  },
  units: units,
  viewType: "teachers-2023",
};

const render = renderWithProviders();

describe("components/AppHeader", () => {
  test("renders correct copy", () => {
    render(<ExemplarUnits {...exemplarUnitsProps} />);

    expect(
      screen.getByText("View and download our early-release units.")
    ).toBeInTheDocument();
    expect(screen.getByText("Secondary units")).toBeInTheDocument();
    expect(
      screen.getByText(
        "“A life saver… I didn’t think you could beat the previous Oak resources.”"
      )
    ).toBeInTheDocument();
  });
  test("renders a list of units", () => {
    const { getByRole, getAllByRole } = render(
      <ExemplarUnits {...exemplarUnitsProps} />
    );

    const list = getByRole("list");
    expect(list).toBeInTheDocument();
    const item = getAllByRole("listitem");
    expect(item[0]).toHaveTextContent(
      "Key stage 4 Year 10 ComputingData Representation9 lessons"
    );
  });
});
