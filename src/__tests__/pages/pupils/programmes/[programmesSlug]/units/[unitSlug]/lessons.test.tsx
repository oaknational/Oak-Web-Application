import { render } from "@testing-library/react";

import PupilLessonListingPage, {
  getStaticProps,
} from "@/pages/pupils/programmes/[programmeSlug]/units/[unitSlug]/lessons";
import * as curriculumApi2023 from "@/node-lib/curriculum-api-2023/__mocks__/index";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import { PupilViewsLessonListing } from "@/components/PupilViews/PupilLessonListing/PupilLessonListing.view";
import { LessonListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilLessonListing/pupilLessonListing.schema";

jest.mock(
  "@/components/PupilViews/PupilLessonListing/PupilLessonListing.view",
  () => ({
    PupilViewsLessonListing: jest.fn((props) => (
      <div>
        {props.orderedCurriculumData.map(
          (data: LessonListingBrowseData[number]) => {
            return <div>{data.lessonData.title}</div>;
          },
        )}
      </div>
    )),
  }),
);

describe("pages/pupils/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]/index", () => {
  describe("renders", () => {
    it("should through error if no data", () => {
      expect(() => {
        render(
          <PupilLessonListingPage
            browseData={[]}
            backLink={{ programmeSlug: "programme-slug" }}
          />,
        );
      }).toThrowError("unitData or programmeFields is undefined");
    });
    it("should call PupilViewsLessonListing with correct props", () => {
      render(
        <PupilLessonListingPage
          browseData={[lessonBrowseDataFixture({})]}
          backLink={{ programmeSlug: "programme-slug" }}
        />,
      );
      expect(PupilViewsLessonListing).toHaveBeenCalled();
    });
    it("should call PupilViewsLessonListing with correctly ordered lessons", () => {
      const { getByText } = render(
        <PupilLessonListingPage
          browseData={[
            lessonBrowseDataFixture({
              lessonData: {
                ...lessonBrowseDataFixture({}).lessonData,
                title: "lesson-title-2",
              },
              supplementaryData: { orderInUnit: 2, unitOrder: 4 },
            }),
            lessonBrowseDataFixture({
              lessonData: {
                ...lessonBrowseDataFixture({}).lessonData,
                title: "lesson-title-1",
              },
              supplementaryData: { orderInUnit: 1, unitOrder: 4 },
            }),
          ]}
          backLink={{ programmeSlug: "programme-slug" }}
        />,
      );
      const e1 = getByText("lesson-title-1");
      const e2 = getByText("lesson-title-2");
      expect(e2.compareDocumentPosition(e1)).toBe(2);
    });
  });

  describe("getStaticProps", () => {
    it("Should call API:pupilLessonListingQuery", async () => {
      const programmeSlug = "programme-slug-secondary-year-10";
      const unitSlug = "unit-slug";

      await getStaticProps({
        params: {
          programmeSlug,
          unitSlug,
        },
      });

      expect(
        curriculumApi2023.default.pupilLessonListingQuery,
      ).toHaveBeenCalledWith({
        programmeSlug,
        unitSlug,
      });
    });
  });
});
