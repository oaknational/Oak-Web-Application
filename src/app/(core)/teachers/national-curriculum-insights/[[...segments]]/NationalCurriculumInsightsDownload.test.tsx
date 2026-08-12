import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { oakColorTokens } from "@oaknational/oak-components";

import { NationalCurriculumInsightsDownload } from "./NationalCurriculumInsightsDownload";
import {
  getNationalCurriculumInsightsRouteData,
  localNationalCurriculumInsightsFixtures,
} from "./getNationalCurriculumInsightsData";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { parseNationalCurriculumInsightsRoute } from "@/common-lib/urls/nationalCurriculumInsights";

const section = {
  __typename: "NationalCurriculumInsightsDownloadSection" as const,
  barHeading: "The national curriculum is changing.",
  barCtaLabel: "Download free expert guidance.",
  detailsHeading: "Your details",
  downloadsHeading: "The national curriculum is changing.",
  downloadsIntroduction:
    "Download free expert guidance for every national curriculum subject.",
  downloadButtonLabel: "Download",
};

const getData = async () => {
  const route = parseNationalCurriculumInsightsRoute(undefined);
  if (!route) throw new Error("Expected the hub route");
  const data = await getNationalCurriculumInsightsRouteData(route, {
    previewMode: false,
    reader: localNationalCurriculumInsightsFixtures.reader,
  });
  if (!data) throw new Error("Expected local Insights data");
  return data;
};

describe("NationalCurriculumInsightsDownload", () => {
  it("expands the green bar and switches between DOCX and ZIP labels", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <NationalCurriculumInsightsDownload
        data={await getData()}
        section={section}
      />,
    );

    const toggle = screen.getByRole("button", {
      name: /the national curriculum is changing/i,
    });
    expect(toggle).toHaveStyle(`background: ${oakColorTokens["dark-aqua"]}`);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    const download = screen.getByRole("button", {
      name: "Download 0 insights (.DOCX)",
    });
    expect(download).toBeDisabled();

    await user.click(
      screen.getByTestId("curriculum-insights-subjects-trigger"),
    );
    const scienceOptions = screen.getAllByRole("checkbox", { name: "Science" });
    const primary = scienceOptions.find(({ id }) =>
      id.includes("science:primary"),
    );
    const secondary = scienceOptions.find(({ id }) =>
      id.includes("science:secondary"),
    );
    if (!primary || !secondary) {
      throw new Error(
        `Expected Science options: ${scienceOptions.map(({ id }) => id).join(", ")}`,
      );
    }
    fireEvent.click(primary);
    expect(
      screen.getByRole("button", { name: "Download 1 insight (.DOCX)" }),
    ).toBeDisabled();

    fireEvent.click(secondary);
    expect(
      screen.getByRole("button", { name: "Download 2 insights (.ZIP)" }),
    ).toBeDisabled();
  });
});
