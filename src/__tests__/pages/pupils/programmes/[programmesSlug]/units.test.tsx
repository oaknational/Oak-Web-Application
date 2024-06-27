import { OakInfoProps } from "@oaknational/oak-components";

import PupilUnitListingPage, {
  getStaticProps,
} from "@/pages/pupils/programmes/[programmeSlug]/units";
import * as curriculumApi2023 from "@/node-lib/curriculum-api-2023/__mocks__/index";
import { unitBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/unitBrowseData.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

jest.mock("next/router", () => require("next-router-mock"));

jest.mock("@oaknational/oak-components", () => {
  return {
    ...jest.requireActual("@oaknational/oak-components"),
    OakInfo: ({ hint }: OakInfoProps) => (
      <>
        <div role="tooltip">{hint}</div>
      </>
    ),
  };
});

describe("pages/pupils/programmes/[programmeSlug]/units", () => {
  describe("rendering", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetModules();
    });

    it("should render the unit titles in the correct order", async () => {
      (
        curriculumApi2023.default.pupilUnitListingQuery as jest.Mock
      ).mockResolvedValueOnce([
        unitBrowseDataFixture({
          unitData: {
            ...unitBrowseDataFixture({}).unitData,
            title: "unit-title-2",
          },
          supplementaryData: { unitOrder: 2 },
          programmeSlug: "maths-secondary-year-10-foundation",
          unitSlug: "unit-slug-2",
        }),
        unitBrowseDataFixture({
          unitData: {
            ...unitBrowseDataFixture({}).unitData,
            title: "unit-title-1",
          },
          supplementaryData: { unitOrder: 1 },
          programmeSlug: "maths-secondary-year-10-foundation",
          unitSlug: "unit-slug-1",
        }),
      ]);

      const getStaticPropsResult = await getStaticProps({
        params: {
          programmeSlug: "maths-secondary-year-10-foundation",
        },
      });

      expect.assertions(1);
      if ("props" in getStaticPropsResult) {
        const { getByText } = render(
          <PupilUnitListingPage {...getStaticPropsResult.props} />,
        );

        const e1 = getByText("unit-title-1");
        const e2 = getByText("unit-title-2");
        expect(e2.compareDocumentPosition(e1)).toBe(2);
      } else {
        throw new Error("getStaticProps did not return props.");
      }
    });

    describe("getStaticProps", () => {
      it("Should call API:pupilUnitLisitngQuery", async () => {
        (
          curriculumApi2023.default.pupilUnitListingQuery as jest.Mock
        ).mockResolvedValueOnce([
          unitBrowseDataFixture({
            unitData: {
              ...unitBrowseDataFixture({}).unitData,
              title: "unit-title-2",
            },
            supplementaryData: { unitOrder: 1 },
            programmeSlug: "maths-secondary-year-10-foundation",
            unitSlug: "unit-slug-2",
          }),
        ]);

        await getStaticProps({
          params: {
            programmeSlug: "maths-secondary-year-10-foundation",
          },
        });

        expect(
          curriculumApi2023.default.pupilUnitListingQuery,
        ).toHaveBeenCalledWith({
          baseSlug: "maths-secondary-year-10",
        });
      });

      it("Should return not found if no params", async () => {
        const result = await getStaticProps({});
        expect(result).toEqual({
          notFound: true,
        });
      });
      it("Should return not found if no programmeSlug", async () => {
        const result = await getStaticProps({ params: { programmeSlug: "" } });
        expect(result).toEqual({
          notFound: true,
        });
      });
      it("Should return not found if no params", async () => {
        const result = await getStaticProps({
          params: { programmeSlug: "notvalidforbaseslug" },
        });
        expect(result).toEqual({
          notFound: true,
        });
      });
      it("Should return not found if no curriculum data", async () => {
        (
          curriculumApi2023.default.pupilUnitListingQuery as jest.Mock
        ).mockResolvedValueOnce([
          unitBrowseDataFixture({
            unitData: {
              ...unitBrowseDataFixture({}).unitData,
              title: "unit-title-2",
            },
            supplementaryData: { unitOrder: 1 },
            programmeSlug: "maths-secondary-year-10-foundation",
            unitSlug: "unit-slug-2",
          }),
        ]);

        expect.assertions(2);
        try {
          await getStaticProps({
            params: { programmeSlug: "english-secondary-year-11" },
          });
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect(error).toMatchObject({ message: "No curriculum data" });
        }
      });
      it("Should add breadcrumbs", async () => {
        (
          curriculumApi2023.default.pupilUnitListingQuery as jest.Mock
        ).mockResolvedValueOnce([
          unitBrowseDataFixture({
            unitData: {
              ...unitBrowseDataFixture({}).unitData,
              title: "unit-title-2",
            },
            supplementaryData: { unitOrder: 1 },
            programmeSlug: "maths-secondary-year-10-foundation",
            unitSlug: "unit-slug-2",
            programmeFields: {
              yearDescription: "Year 10",
              examboard: "AQA",
              tierDescription: "Higher",
            },
          }),
        ]);

        const result = await getStaticProps({
          params: {
            programmeSlug: "maths-secondary-year-10-foundation",
          },
        });
        expect.assertions(1);
        if ("props" in result && result?.props?.unitSections[0]?.breadcrumbs) {
          expect(result?.props?.unitSections[0]?.breadcrumbs).toEqual([
            "Year 10",
            "AQA",
            "Higher",
          ]);
        }
      });
    });
  });
});
