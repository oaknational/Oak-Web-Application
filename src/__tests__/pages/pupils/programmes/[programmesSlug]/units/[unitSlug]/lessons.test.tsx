import { render } from "@testing-library/react";

import PupilLessonListingPage, {
  getStaticProps,
} from "@/pages/pupils/beta//programmes/[programmeSlug]/units/[unitSlug]/lessons";
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
    it("should call PupilViewsLessonListing with correct props", () => {
      render(
        <PupilLessonListingPage
          curriculumData={[lessonBrowseDataFixture({})]}
        />,
      );
      expect(PupilViewsLessonListing).toHaveBeenCalled();
    });
    it("should call PupilViewsLessonListing with correctly ordered lessons", () => {
      const { getByText } = render(
        <PupilLessonListingPage
          curriculumData={[
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
        />,
      );
      const e1 = getByText("lesson-title-1");
      const e2 = getByText("lesson-title-2");
      expect(e2.compareDocumentPosition(e1)).toBe(2);
    });
  });

  describe("getStaticProps", () => {
    it("Should call API:pupilLessonLisitngQuery", async () => {
      await getStaticProps({
        params: {
          programmeSlug: "ks123",
          unitSlug: "unitSlug",
        },
      });

      expect(
        curriculumApi2023.default.pupilLessonListingQuery,
      ).toHaveBeenCalledWith({
        programmeSlug: "ks123",
        unitSlug: "unitSlug",
      });
    });
  });
});
