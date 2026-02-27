import React from "react";

import Page from "./page";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

const subjectsPageViewMock = jest.fn();

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      browseRefined: jest.fn(),
    },
  }),
}));

jest.mock("@oaknational/google-classroom-addon/ui", () => ({
  SubjectsPageView: (props: never) => {
    subjectsPageViewMock(props);
    return <div data-testid="subjects-view">Subjects</div>;
  },
}));

jest.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  },
}));

jest.mock("@/node-lib/curriculum-api-2023");

describe("src/app/classroom/browse/years/[yearSlug]/subjects/page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders subjects view with expected templates", async () => {
    (curriculumApi2023.pupilSubjectListingQuery as jest.Mock).mockResolvedValue(
      {
        curriculumData: [{ programmeSlug: "prog-1", subjectSlug: "maths" }],
      },
    );

    renderWithTheme(
      await Page({ params: Promise.resolve({ yearSlug: "year-3" }) }),
    );

    expect(curriculumApi2023.pupilSubjectListingQuery).toHaveBeenCalledWith({
      yearSlug: "year-3",
    });
    expect(subjectsPageViewMock).toHaveBeenCalledWith(
      expect.objectContaining({
        subjects: expect.arrayContaining([
          expect.objectContaining({ programmeSlug: "prog-1" }),
        ]),
        unitsUrlTemplate: "/classroom/browse/programmes/:programmeSlug/units",
        optionsUrlTemplate:
          "/classroom/browse/programmes/:programmeSlug/options",
      }),
    );
  });

  it("returns 404 when no curriculum data is returned", async () => {
    (curriculumApi2023.pupilSubjectListingQuery as jest.Mock).mockResolvedValue(
      {
        curriculumData: [],
      },
    );

    await expect(
      Page({ params: Promise.resolve({ yearSlug: "year-x" }) }),
    ).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });
});
