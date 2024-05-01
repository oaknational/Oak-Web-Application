import { render } from "@testing-library/react";

import PupilSubjectListing, {
  getStaticPaths,
  getStaticProps,
} from "@/pages/pupils/beta/years/[yearSlug]/subjects";
import * as curriculumApi2023 from "@/node-lib/curriculum-api-2023/__mocks__/index";
import { subjectBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/subjectBrowseData.fixture";

describe("PupilSubjectListing", () => {
  it("renders correctly", () => {
    const { getByText } = render(
      <PupilSubjectListing curriculumData={[subjectBrowseDataFixture({})]} />,
    );
    expect(getByText("maths")).toBeInTheDocument();
  });
  it("should render subjects alphabetically", () => {
    const { getByText } = render(
      <PupilSubjectListing
        curriculumData={[
          subjectBrowseDataFixture({
            programmeFields: {
              ...subjectBrowseDataFixture({}).programmeFields,
              subjectSlug: "maths",
            },
          }),
          subjectBrowseDataFixture({
            programmeFields: {
              ...subjectBrowseDataFixture({}).programmeFields,
              subjectSlug: "biology",
            },
          }),
        ]}
      />,
    );
    const e1 = getByText("biology");
    const e2 = getByText("maths");
    expect(e2.compareDocumentPosition(e1)).toBe(2);
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
    it("Should call API:pupilSubjectLisitngQuery", async () => {
      await getStaticProps({
        params: {
          yearSlug: "ks123",
        },
      });

      expect(
        curriculumApi2023.default.pupilSubjectListingQuery,
      ).toHaveBeenCalledWith({
        yearSlug: "ks123",
        isLegacy: true,
      });
    });
  });
});
