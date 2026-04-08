import { screen } from "@testing-library/react";

import { SubjectToggle } from "./SubjectToggle";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { resolveOakHref } from "@/common-lib/urls";
import { ProgrammeToggles } from "@/node-lib/curriculum-api-2023/queries/teachersUnitOverview/teachersUnitOverview.schema";

const render = renderWithProviders();

const defaultToggles: ProgrammeToggles = [
  {
    title: "Biology",
    programmeSlug: "biology-secondary-ks4-foundation-aqa",
    isSelected: true,
  },
  {
    title: "Combined science",
    programmeSlug: "combined-science-secondary-ks4-foundation-aqa",
    isSelected: false,
  },
];

describe("SubjectToggle", () => {
  it("renders nothing when there are no subject toggles", () => {
    render(<SubjectToggle unitSlug="cells" subjectOptionToggles={[]} />);

    expect(
      screen.queryByRole("heading", { name: "Subject" }),
    ).not.toBeInTheDocument();
  });

  it("renders nothing when there is only one subject toggle option", () => {
    render(
      <SubjectToggle
        unitSlug="cells"
        subjectOptionToggles={[defaultToggles[0]!]}
      />,
    );

    expect(
      screen.queryByRole("heading", { name: "Subject" }),
    ).not.toBeInTheDocument();
  });

  it("renders heading and links from subjectOptionToggles", () => {
    render(
      <SubjectToggle unitSlug="cells" subjectOptionToggles={defaultToggles} />,
    );

    expect(
      screen.getByRole("heading", { name: "Subject" }),
    ).toBeInTheDocument();

    const biology = screen.getByRole("link", { name: "Biology" });
    const combinedScience = screen.getByRole("link", {
      name: "Combined science",
    });

    expect(biology).toHaveAttribute("aria-current", "page");
    expect(biology).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "unit-page",
        subjectPhaseSlug: "biology-secondary-ks4-foundation-aqa",
        unitSlug: "cells",
      }),
    );
    expect(combinedScience).not.toHaveAttribute("aria-current");
    expect(combinedScience).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "unit-page",
        subjectPhaseSlug: "combined-science-secondary-ks4-foundation-aqa",
        unitSlug: "cells",
      }),
    );
  });

  it("marks the selected option as current from data", () => {
    render(
      <SubjectToggle
        unitSlug="cells"
        subjectOptionToggles={[
          {
            title: "Biology",
            programmeSlug: "biology-secondary-ks4-foundation-aqa",
            isSelected: false,
          },
          {
            title: "Combined science",
            programmeSlug: "combined-science-secondary-ks4-foundation-aqa",
            isSelected: true,
          },
        ]}
      />,
    );

    const biology = screen.getByRole("link", { name: "Biology" });
    const combinedScience = screen.getByRole("link", {
      name: "Combined science",
    });

    expect(biology).not.toHaveAttribute("aria-current");
    expect(combinedScience).toHaveAttribute("aria-current", "page");
  });
});
