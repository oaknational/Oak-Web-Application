import { render } from "@testing-library/react";

import PupilLessonListingPage, {
  getStaticPaths,
  getStaticProps,
} from "@/pages/pupils/beta//programmes/[programmeSlug]/units/[unitSlug]/lessons";
import * as curriculumApi2023 from "@/node-lib/curriculum-api-2023/__mocks__/index";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";

describe("pages/pupils/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]/index", () => {
  describe("renders", () => {
    it("should render the subjectTitle, unitTitle, and yearDescription", () => {
      const { getByText } = render(
        <PupilLessonListingPage
          curriculumData={[lessonBrowseDataFixture({})]}
        />,
      );
      expect(getByText("subject")).toBeInTheDocument();
      expect(getByText("unit-title")).toBeInTheDocument();
      expect(getByText("year-description")).toBeInTheDocument();
    });
    it("should render the lesson titles as a tags", () => {
      const { getByText } = render(
        <PupilLessonListingPage
          curriculumData={[lessonBrowseDataFixture({})]}
        />,
      );
      expect(getByText("lesson-title")).toBeInTheDocument();
    });
  });
  describe("getStaticPaths", () => {
    it("Should not generate pages at build time", async () => {
      const res = await getStaticPaths();
      expect(res).toEqual({
        fallback: "blocking",
        paths: [],
      });
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
