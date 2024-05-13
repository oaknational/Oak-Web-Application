import PupilSubjectListing, {
  getStaticPaths,
  getStaticProps,
} from "@/pages/pupils/beta/years/[yearSlug]/subjects";
import * as curriculumApi2023 from "@/node-lib/curriculum-api-2023/__mocks__/index";
import { subjectBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/subjectBrowseData.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

jest.mock("next/router", () => require("next-router-mock"));

describe("PupilSubjectListing", () => {
  it("renders correctly", () => {
    const { getByText } = render(
      <PupilSubjectListing curriculumData={[subjectBrowseDataFixture({})]} />,
    );
    expect(getByText("Now choose a subject")).toBeInTheDocument();
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
