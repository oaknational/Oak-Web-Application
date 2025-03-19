import { render, screen } from "@testing-library/react";

import FinancialEducationDescription from "./FinancialEducationDescription";

import unitListingFixture from "@/node-lib/curriculum-api-2023/fixtures/unitListing.fixture";
import { UnitListingData } from "@/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";

// Mock resolveOakHref to generate predictable URLs
jest.mock("@/common-lib/urls", () => ({
  resolveOakHref: jest.fn(({ page, programmeSlug, keyStageSlug }) => {
    if (page === "unit-index") return `/unit-index/${programmeSlug}`;
    if (page === "subject-index") return `/subject-index/${keyStageSlug}`;
    return "#";
  }),
}));

jest.mock("@oaknational/oak-components", () => ({
  OakLink: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
  OakP: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
}));

describe("FinancialEducationDescription", () => {
  // A helper function to render the component with a given unitListingData prop.
  const renderComponent = (unitListingData: UnitListingData) => {
    render(<FinancialEducationDescription unitListingData={unitListingData} />);
  };

  it("renders correctly for 'ks4' with citizenship link", () => {
    const unitListingData = unitListingFixture({
      keyStageSlug: "ks4",
      keyStageTitle: "Key Stage 4",
    });

    renderComponent(unitListingData);

    // Check subject-index link text (should be lowercased keyStageTitle)
    const subjectIndexLink = screen.getByRole("link", {
      name: /^Key Stage 4$/i,
    });
    expect(subjectIndexLink).toBeInTheDocument();
    expect(subjectIndexLink).toHaveAttribute("href", "/subject-index/ks4");

    // Check maths link (from ks4 data)
    const mathsLink = screen.getByRole("link", { name: /KS4 maths/i });
    expect(mathsLink).toBeInTheDocument();
    expect(mathsLink).toHaveAttribute(
      "href",
      "/unit-index/maths-secondary-ks4-higher",
    );

    // Check citizenship link (should be displayed for ks4)
    const citizenshipLink = screen.getByRole("link", {
      name: /^citizenship$/i,
    });
    expect(citizenshipLink).toBeInTheDocument();
    expect(citizenshipLink).toHaveAttribute(
      "href",
      "/unit-index/citizenship-secondary-ks4-core",
    );

    // Check RSHE link (from ks4 data)
    const rsheLink = screen.getByRole("link", { name: /RSHE \(PSHE\)/i });
    expect(rsheLink).toBeInTheDocument();
    expect(rsheLink).toHaveAttribute(
      "href",
      "/unit-index/rshe-pshe-secondary-ks4",
    );
  });

  it("renders correctly for 'ks2' without citizenship link", () => {
    const unitListingData = unitListingFixture({
      keyStageSlug: "ks2",
      keyStageTitle: "Key Stage 2",
    });

    renderComponent(unitListingData);

    // Subject index link should reflect the passed keyStageSlug
    const subjectIndexLink = screen.getByRole("link", {
      name: /^Key Stage 2$/i,
    });
    expect(subjectIndexLink).toBeInTheDocument();
    expect(subjectIndexLink).toHaveAttribute("href", "/subject-index/ks2");

    // Maths link for ks2
    const mathsLink = screen.getByRole("link", { name: /KS2 maths/i });
    expect(mathsLink).toBeInTheDocument();
    expect(mathsLink).toHaveAttribute("href", "/unit-index/maths-primary-ks2");

    // Citizenship link should not be rendered for ks2 (as display is false)
    const citizenshipLink = screen.queryByRole("link", {
      name: /^citizenship$/i,
    });
    expect(citizenshipLink).toBeNull();

    // RSHE link for ks2
    const rsheLink = screen.getByRole("link", { name: /RSHE \(PSHE\)/i });
    expect(rsheLink).toBeInTheDocument();
    expect(rsheLink).toHaveAttribute(
      "href",
      "/unit-index/rshe-pshe-primary-ks2",
    );
  });

  it("falls back to ks4 links when an unknown keyStageSlug is provided", () => {
    const unitListingData = unitListingFixture({
      keyStageSlug: "ks1", // not defined in linkData; should fall back to ks4
      keyStageTitle: "Key Stage 1",
    });

    renderComponent(unitListingData);

    // The subject-index link uses the provided keyStageSlug (ks1)
    const subjectIndexLink = screen.getByRole("link", { name: /Key Stage 1/i });
    expect(subjectIndexLink).toBeInTheDocument();
    expect(subjectIndexLink).toHaveAttribute("href", "/subject-index/ks1");

    // The unit index links fall back to the ks4 configuration:
    const mathsLink = screen.getByRole("link", { name: /KS4 maths/i });
    expect(mathsLink).toBeInTheDocument();
    expect(mathsLink).toHaveAttribute(
      "href",
      "/unit-index/maths-secondary-ks4-higher",
    );

    const citizenshipLink = screen.getByRole("link", {
      name: /^citizenship$/i,
    });
    expect(citizenshipLink).toBeInTheDocument();
    expect(citizenshipLink).toHaveAttribute(
      "href",
      "/unit-index/citizenship-secondary-ks4-core",
    );

    const rsheLink = screen.getByRole("link", { name: /RSHE \(PSHE\)/i });
    expect(rsheLink).toBeInTheDocument();
    expect(rsheLink).toHaveAttribute(
      "href",
      "/unit-index/rshe-pshe-secondary-ks4",
    );
  });
});
