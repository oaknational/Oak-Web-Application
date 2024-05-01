import { render } from "@testing-library/react";

import PupilUnitListingPage, {
  getStaticProps,
} from "@/pages/pupils/beta//programmes/[programmeSlug]/units";
import * as curriculumApi2023 from "@/node-lib/curriculum-api-2023/__mocks__/index";
import { unitBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/unitBrowseData.fixture";

describe("pages/pupils/programmes/[programmeSlug]/units", () => {
  describe("renders", () => {
    it("should render the subjectTitle, unitTitle, and yearDescription", () => {
      const { getByText } = render(
        <PupilUnitListingPage
          curriculumData={[
            unitBrowseDataFixture({
              programmeSlug: "maths-secondary-year-10-aqa-core",
            }),
          ]}
        />,
      );
      expect(getByText("Maths")).toBeInTheDocument();
      expect(getByText("Year 1")).toBeInTheDocument();
    });
    it("should render the unit titles and number of lessons", () => {
      const { getByText } = render(
        <PupilUnitListingPage
          curriculumData={[
            unitBrowseDataFixture({
              programmeSlug: "maths-secondary-year-10-aqa-core",
            }),
          ]}
        />,
      );
      expect(getByText("unit-title - 1 lessons")).toBeInTheDocument();
    });
    it("should render the unit titles in the correct order", () => {
      const { getByText } = render(
        <PupilUnitListingPage
          curriculumData={[
            unitBrowseDataFixture({
              unitData: {
                ...unitBrowseDataFixture({}).unitData,
                title: "unit-title-2",
              },
              supplementaryData: { unitOrder: 2 },
              programmeSlug: "maths-secondary-year-10-aqa-core",
            }),
            unitBrowseDataFixture({
              unitData: {
                ...unitBrowseDataFixture({}).unitData,
                title: "unit-title-1",
              },
              supplementaryData: { unitOrder: 1 },
              programmeSlug: "maths-secondary-year-10-aqa-core",
            }),
          ]}
        />,
      );
      const e1 = getByText("unit-title-1 - 1 lessons");
      const e2 = getByText("unit-title-2 - 1 lessons");
      expect(e2.compareDocumentPosition(e1)).toBe(2);
    });
    it("should render a link which links back to tiers if the programme has tiers", () => {
      const { getByText } = render(
        <PupilUnitListingPage
          curriculumData={[
            unitBrowseDataFixture({
              programmeFields: {
                ...unitBrowseDataFixture({}).programmeFields,
                tier: "core",
                examboard: "AQA",
                tierSlug: "core",
                examboardSlug: "aqa",
              },
              supplementaryData: { unitOrder: 2 },
              programmeSlug: "maths-secondary-year-10-aqa-core",
            }),
          ]}
        />,
      );
      expect(getByText("Select tiers")).toBeInTheDocument();
    });
    it("should render a link which links back to subjects if the programme has no tiers and no examboards", () => {
      const { getByText } = render(
        <PupilUnitListingPage
          curriculumData={[
            unitBrowseDataFixture({ programmeSlug: "maths-secondary-year-10" }),
          ]}
        />,
      );
      expect(getByText("Select subjects")).toBeInTheDocument();
    });
    it("should render a link which links back to examboards if the programme has examboards and no tiers", () => {
      const { getByText } = render(
        <PupilUnitListingPage
          curriculumData={[
            unitBrowseDataFixture({
              programmeSlug: "maths-secondary-year-10-aqa",
              programmeFields: {
                ...unitBrowseDataFixture({}).programmeFields,
                examboard: "AQA",
                examboardSlug: "aqa",
              },
            }),
          ]}
        />,
      );

      expect(getByText("Select examboards")).toBeInTheDocument();
    });
  });

  describe("getStaticProps", () => {
    it("Should call API:pupilUnitLisitngQuery", async () => {
      await getStaticProps({
        params: {
          programmeSlug: "ks123",
        },
      });

      expect(
        curriculumApi2023.default.pupilUnitListingQuery,
      ).toHaveBeenCalledWith({
        programmeSlug: "ks123",
      });
    });
  });
});
