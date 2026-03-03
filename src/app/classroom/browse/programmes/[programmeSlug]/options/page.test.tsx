import React from "react";

import Page from "./page";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { getAvailableProgrammeFactor } from "@/pages-helpers/pupil/options-pages/getAvailableProgrammeFactor";

const optionsViewMock = jest.fn();

jest.mock("@oaknational/google-classroom-addon/ui", () => ({
  OptionsView: (props: never) => {
    optionsViewMock(props);
    return <div data-testid="options-view">Options</div>;
  },
}));

jest.mock("@/node-lib/curriculum-api-2023");
jest.mock("@/pages-helpers/pupil/options-pages/getAvailableProgrammeFactor");

describe("src/app/classroom/browse/programmes/[programmeSlug]/options/page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders options view and calls server action", async () => {
    (
      curriculumApi2023.pupilProgrammeListingQuery as jest.Mock
    ).mockResolvedValue([{ programmeSlug: "maths-h", yearSlug: "year-10" }]);
    (getAvailableProgrammeFactor as jest.Mock).mockResolvedValue("tier:x");

    renderWithTheme(
      await Page({ params: Promise.resolve({ programmeSlug: "maths-h" }) }),
    );

    expect(curriculumApi2023.pupilProgrammeListingQuery).toHaveBeenCalledWith({
      baseSlug: "maths-h",
    });

    const props = optionsViewMock.mock.calls[0][0];
    expect(props.backUrlTemplate).toBe(
      "/classroom/browse/years/:yearSlug/subjects",
    );
    expect(props.programmeUrlTemplate).toBe(
      "/classroom/browse/programmes/:programmeSlug/units",
    );

    const result = await props.getAvailableProgrammeFactorAction({
      factorPrefix: "tier",
    });
    expect(getAvailableProgrammeFactor).toHaveBeenCalledWith(
      expect.objectContaining({
        programmes: [{ programmeSlug: "maths-h", yearSlug: "year-10" }],
      }),
    );
    expect(result).toBe("tier:x");
  });

  it("falls back to /classroom/browse when no yearSlug", async () => {
    (
      curriculumApi2023.pupilProgrammeListingQuery as jest.Mock
    ).mockResolvedValue([{ programmeSlug: "subject-unknown" }]);

    renderWithTheme(
      await Page({
        params: Promise.resolve({ programmeSlug: "subject-unknown" }),
      }),
    );

    expect(optionsViewMock).toHaveBeenCalledWith(
      expect.objectContaining({ backUrlTemplate: "/classroom/browse" }),
    );
  });
});
