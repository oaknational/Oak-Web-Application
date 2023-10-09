import { screen } from "@testing-library/react";

import { UnitListItemProps } from "../UnitAndLessonLists/UnitList/UnitListItem/UnitListItem";

import { EarlyReleaseExemplarUnitsProps } from "./EarlyReleaseExemplarUnits";

import ExemplarUnits from ".";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import unitListingFixture from "@/node-lib/curriculum-api/fixtures/unitListing.fixture";

const units = unitListingFixture()
  .units.slice(0, 10)
  .map((unit) => unit[0]) as unknown as UnitListItemProps[];

const earlyReleaseExemplarUnitsProps: EarlyReleaseExemplarUnitsProps = {
  heading: "Secondary units",
  subHeading: "View and download our early-release units.",
  color: "lavender50",
  quote: {
    text: "A life saver… I didn’t think you could beat the previous Oak resources.",
    author: "— Sophie Baker",
    occupation: "Class Teacher, St Agnes Academy",
  },
  units: units,
};

const render = renderWithProviders();

describe("components/AppHeader", () => {
  test("renders correct copy", () => {
    render(<ExemplarUnits {...earlyReleaseExemplarUnitsProps} />);

    expect(
      screen.getByText("View and download our early-release units."),
    ).toBeInTheDocument();
    expect(screen.getByText("Secondary units")).toBeInTheDocument();
    expect(
      screen.getByText(
        "“A life saver… I didn’t think you could beat the previous Oak resources.”",
      ),
    ).toBeInTheDocument();
  });
  test("renders a list of units", () => {
    const { getByRole, getAllByRole } = render(
      <ExemplarUnits {...earlyReleaseExemplarUnitsProps} />,
    );

    const list = getByRole("list");
    expect(list).toBeInTheDocument();
    const item = getAllByRole("listitem");
    expect(item[0]).toHaveTextContent(
      "Key stage 4 Year 10 ComputingData Representation9 lessons",
    );
  });
});
