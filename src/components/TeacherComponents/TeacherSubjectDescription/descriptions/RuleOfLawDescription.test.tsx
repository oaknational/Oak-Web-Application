import { screen } from "@testing-library/react";

import RuleOfLawDescription from "./RuleOfLawDescription";

import unitListingFixture from "@/node-lib/curriculum-api-2023/fixtures/unitListing.fixture";
import { UnitListingData } from "@/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("RuleOfLawDescription", () => {
  const renderComponent = (unitListingData: UnitListingData) => {
    renderWithTheme(<RuleOfLawDescription unitListingData={unitListingData} />);
  };

  it("renders correctly for key stage 1", () => {
    const singleUnit = unitListingFixture().units.flat()[0]!;
    const unitListingData = unitListingFixture({
      keyStageSlug: "ks1",
      keyStageTitle: "Key Stage 1",
      units: [[singleUnit]],
    });

    renderComponent(unitListingData);

    const subjectIndexLink = screen.getByRole("link", {
      name: /key stage 1/i,
    });
    expect(subjectIndexLink).toBeInTheDocument();
    expect(subjectIndexLink).toHaveAttribute(
      "href",
      "/teachers/key-stages/ks1/subjects",
    );

    const description = screen.getByRole("paragraph");
    expect(description).toHaveTextContent(
      /Explore our key stage 1 rule of law lesson/,
    );
    expect(description).toHaveTextContent(/which can be used in year 1 or 2/);
    expect(description).toHaveTextContent(
      /slide deck, worksheet, quiz and lesson overview/,
    );
  });

  it("renders correctly for key stage 2", () => {
    const unitListingData = unitListingFixture({
      keyStageSlug: "ks2",
      keyStageTitle: "Key Stage 2",
    });

    renderComponent(unitListingData);

    const subjectIndexLink = screen.getByRole("link", {
      name: /key stage 2/i,
    });
    expect(subjectIndexLink).toBeInTheDocument();
    expect(subjectIndexLink).toHaveAttribute(
      "href",
      "/teachers/key-stages/ks2/subjects",
    );

    const description = screen.getByRole("paragraph");
    expect(description).toHaveTextContent(
      /Explore our key stage 2 rule of law lessons/,
    );
    expect(description).toHaveTextContent(
      /which can be used in year 3, 4, 5 or 6/,
    );
    expect(description).toHaveTextContent(
      /slide deck, worksheet, quizzes and lesson overview/,
    );
  });

  it("returns null when an unsupported key stage is provided", () => {
    const unitListingData = unitListingFixture({
      keyStageSlug: "ks4",
      keyStageTitle: "Key Stage 4",
    });

    renderComponent(unitListingData);

    expect(screen.queryByText(/rule of law/)).toBeNull();
  });
});
