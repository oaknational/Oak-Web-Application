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

    it("should render the unit titles in the correct order", () => {
      const { getByText } = render(
        <PupilUnitListingPage
          programmeSlug="maths-secondary-year-10-aqa-core"
          curriculumData={[
            unitBrowseDataFixture({
              unitData: {
                ...unitBrowseDataFixture({}).unitData,
                title: "unit-title-2",
              },
              supplementaryData: { unitOrder: 2 },
              programmeSlug: "maths-secondary-year-10-aqa-core",
              unitSlug: "unit-slug-2",
            }),
            unitBrowseDataFixture({
              unitData: {
                ...unitBrowseDataFixture({}).unitData,
                title: "unit-title-1",
              },
              supplementaryData: { unitOrder: 1 },
              programmeSlug: "maths-secondary-year-10-aqa-core",
              unitSlug: "unit-slug-1",
            }),
          ]}
        />,
      );
      const e1 = getByText("unit-title-1");
      const e2 = getByText("unit-title-2");
      expect(e2.compareDocumentPosition(e1)).toBe(2);
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
          baseSlug: "ks123",
        });
      });
    });
  });
});
