import React from "react";

import Page from "./page";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

const lessonListingViewMock = jest.fn();

jest.mock("@oaknational/google-classroom-addon/ui", () => ({
  LessonListingView: (props: never) => {
    lessonListingViewMock(props);
    return <div data-testid="lessons-view">Lessons</div>;
  },
}));

jest.mock("@/node-lib/curriculum-api-2023");

jest.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  },
}));

describe("src/app/classroom/browse/programmes/[programmeSlug]/units/[unitSlug]/lessons/page", () => {
  beforeEach(() => jest.clearAllMocks());

  it("fetches lessons and sorts by orderInUnit", async () => {
    const browseData = [
      {
        lessonSlug: "lesson-b",
        supplementaryData: { orderInUnit: 2 },
        unitData: { title: "Unit" },
        programmeFields: { subjectSlug: "maths" },
      },
      {
        lessonSlug: "lesson-a",
        supplementaryData: { orderInUnit: 1 },
        unitData: { title: "Unit" },
        programmeFields: { subjectSlug: "maths" },
      },
    ];
    (curriculumApi2023.pupilLessonListingQuery as jest.Mock).mockResolvedValue({
      browseData,
    });

    renderWithTheme(
      await Page({
        params: Promise.resolve({
          programmeSlug: "maths-h",
          unitSlug: "algebra-1",
        }),
      }),
    );

    expect(curriculumApi2023.pupilLessonListingQuery).toHaveBeenCalledWith({
      programmeSlug: "maths-h",
      unitSlug: "algebra-1",
    });

    const props = lessonListingViewMock.mock.calls[0][0];
    expect(
      props.browseData.map(
        (lesson: { lessonSlug: string }) => lesson.lessonSlug,
      ),
    ).toEqual(["lesson-a", "lesson-b"]);
    expect(props.headerLeftSlot).toBeTruthy();
    expect(props.programmeUrlTemplate).toBe(
      "/classroom/browse/programmes/:programmeSlug/units",
    );
  });

  it("returns 404 when no lesson browse data is returned", async () => {
    (curriculumApi2023.pupilLessonListingQuery as jest.Mock).mockResolvedValue({
      browseData: [],
    });

    await expect(
      Page({
        params: Promise.resolve({
          programmeSlug: "maths-h",
          unitSlug: "algebra-1",
        }),
      }),
    ).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });

  it("returns 404 when lesson browse data is missing required fields", async () => {
    (curriculumApi2023.pupilLessonListingQuery as jest.Mock).mockResolvedValue({
      browseData: [
        {
          lessonSlug: "lesson-a",
          supplementaryData: { orderInUnit: 1 },
        },
      ],
    });

    await expect(
      Page({
        params: Promise.resolve({
          programmeSlug: "maths-h",
          unitSlug: "algebra-1",
        }),
      }),
    ).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });
});
