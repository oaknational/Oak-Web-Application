import { act, render } from "@testing-library/react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { BrowseFactorSelector } from "./BrowseFactorSelector";

import {
  pupilProgrammeListingFixtureEBs,
  pupilProgrammeListingFixtureEBsTiers,
  pupilProgrammeListingFixturePathwaysEBs,
} from "@/node-lib/curriculum-api-2023/fixtures/pupilProgrammeListing.fixture";
import { getAvailableProgrammeFactor } from "@/pages-helpers/pupil/options-pages/getAvailableProgrammeFactor";

const programmesEB = pupilProgrammeListingFixtureEBs();
const examboardsEBs = getAvailableProgrammeFactor({
  programmes: programmesEB,
  factorPrefix: "examboard",
});

const programmesEBsTiers = pupilProgrammeListingFixtureEBsTiers();
const examboardsEBsTiers = getAvailableProgrammeFactor({
  programmes: programmesEBsTiers,
  factorPrefix: "examboard",
});

const modifiedProgrammesEBsTiers = programmesEBsTiers.filter(
  (p) =>
    !(
      p.programmeFields.tierSlug === "foundation" &&
      p.programmeFields.examboardSlug === "aqa"
    ),
);
const tiersModifiedEBsTiers = getAvailableProgrammeFactor({
  programmes: modifiedProgrammesEBsTiers,
  factorPrefix: "tier",
});

const programmesPathwaysEBs = pupilProgrammeListingFixturePathwaysEBs();
const pathwaysPathwaysEBs = getAvailableProgrammeFactor({
  programmes: programmesPathwaysEBs,
  factorPrefix: "pathway",
});

describe("BrowseExamboardSelector", () => {
  it("should render the options", () => {
    const { getByText } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <BrowseFactorSelector
          factorType="examboard"
          programmes={programmesEB}
          factors={examboardsEBs}
          chosenFactors={{
            pathway: null,
            examboard: null,
            tier: null,
          }}
          onClick={() => {}}
          baseSlug="my-subject"
          phaseSlug="secondary"
        />
      </OakThemeProvider>,
    );

    for (const e of examboardsEBs) {
      const button = getByText(e.factor ?? "");
      expect(button).toBeInTheDocument();
    }
  });

  it("should render the options as links where there are no further options to be chosen", () => {
    const { getAllByRole } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <BrowseFactorSelector
          factorType="examboard"
          programmes={programmesEB}
          factors={examboardsEBs}
          chosenFactors={{
            pathway: null,
            examboard: null,
            tier: null,
          }}
          onClick={() => {}}
          baseSlug="my-subject"
          phaseSlug="secondary"
        />
      </OakThemeProvider>,
    );

    expect(getAllByRole("link")).toHaveLength(examboardsEBs.length);
  });

  it("should render the options as buttons where there are further options to be chosen", () => {
    const { getAllByRole } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <BrowseFactorSelector
          factorType="examboard"
          programmes={programmesEBsTiers}
          factors={examboardsEBsTiers}
          chosenFactors={{
            pathway: null,
            examboard: null,
            tier: null,
          }}
          onClick={() => {}}
          baseSlug="my-subject"
          phaseSlug="secondary"
        />
      </OakThemeProvider>,
    );

    expect(getAllByRole("button")).toHaveLength(examboardsEBsTiers.length);
  });

  it("should inspect the possible options for each factor independently", () => {
    const { getAllByRole } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <BrowseFactorSelector
          factorType="pathway"
          programmes={programmesPathwaysEBs}
          factors={pathwaysPathwaysEBs}
          chosenFactors={{
            pathway: null,
            examboard: null,
            tier: null,
          }}
          onClick={() => {}}
          baseSlug="my-subject"
          phaseSlug="secondary"
        />
      </OakThemeProvider>,
    );

    expect(getAllByRole("button")).toHaveLength(1);
    expect(getAllByRole("link")).toHaveLength(1);
  });

  it("should consider previously chosen factors when rendering the options", () => {
    const chosenExamboard = examboardsEBs.find((e) => e.factorSlug === "aqa");
    if (!chosenExamboard) {
      throw new Error("Could not find the chosen examboard");
    }
    const { queryAllByRole } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <BrowseFactorSelector
          factorType="tier"
          programmes={modifiedProgrammesEBsTiers}
          factors={tiersModifiedEBsTiers}
          chosenFactors={{
            pathway: null,
            examboard: chosenExamboard,
            tier: null,
          }}
          onClick={() => {}}
          baseSlug="my-subject"
          phaseSlug="secondary"
        />
      </OakThemeProvider>,
    );
    expect(queryAllByRole("button")).toHaveLength(0);
    expect(queryAllByRole("link")).toHaveLength(1);
  });

  it("should append the legacy suffix to the slug if the isLegacy flag is set", () => {
    const legacyFactors = examboardsEBs.map((e) => ({
      ...e,
      isLegacy: true,
    }));

    const { getAllByRole } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <BrowseFactorSelector
          factorType="examboard"
          programmes={programmesEB}
          factors={legacyFactors}
          chosenFactors={{
            pathway: null,
            examboard: null,
            tier: null,
          }}
          onClick={() => {}}
          baseSlug="my-subject"
          phaseSlug="secondary"
        />
      </OakThemeProvider>,
    );

    const button = getAllByRole("link");
    button.forEach((b) => {
      expect(b).toHaveAttribute("href", expect.stringContaining("-l"));
    });
  });
  it("should fire the onClick callback when a factor link is clicked", () => {
    const onClick = vi.fn();
    const onClickCallback = vi.fn();

    const { getByText } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <BrowseFactorSelector
          factorType="examboard"
          programmes={programmesEB}
          factors={examboardsEBs}
          chosenFactors={{
            pathway: null,
            examboard: null,
            tier: null,
          }}
          onClick={onClick}
          baseSlug="my-subject"
          phaseSlug="secondary"
          onTrackingCallback={onClickCallback}
        />
      </OakThemeProvider>,
    );
    // Find the button and log its presence
    const button = getByText(examboardsEBs[0]?.factor ?? "");
    expect(button).toBeInTheDocument(); // Ensure the button exists
    expect(button).toHaveTextContent("AQA"); // Ensure the button has the correct text

    // Simulate the button click
    act(() => {
      button.click(); // Manually trigger click
    });
    expect(onClickCallback).toHaveBeenCalled();
  });
  it("should fire the onClick callback when a factor button is clicked", () => {
    const onClickCallback = vi.fn();

    const { getByText } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <BrowseFactorSelector
          factorType="examboard"
          programmes={programmesEBsTiers}
          factors={examboardsEBsTiers}
          chosenFactors={{
            pathway: null,
            examboard: null,
            tier: null,
          }}
          onClick={() => {}}
          baseSlug="my-subject"
          phaseSlug="secondary"
          onTrackingCallback={onClickCallback}
        />
      </OakThemeProvider>,
    );
    // Find the button and log its presence
    const button = getByText(examboardsEBs[0]?.factor ?? "");
    expect(button).toBeInTheDocument(); // Ensure the button exists
    expect(button).toHaveTextContent("AQA"); // Ensure the button has the correct text

    // Simulate the button click
    act(() => {
      button.click(); // Manually trigger click
    });
    expect(onClickCallback).toHaveBeenCalled();
  });
});
