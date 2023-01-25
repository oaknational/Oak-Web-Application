import { screen, waitFor } from "@testing-library/react";

import teachersKeyStageSubjectTiersFixture from "../../../../../../../node-lib/curriculum-api/fixtures/teachersKeyStageSubjectTiers.fixture";
import curriculumApi from "../../../../../../../node-lib/curriculum-api/__mocks__";
import TierListingPage, {
  getStaticPaths,
  getStaticProps,
} from "../../../../../../../pages/beta/teachers/key-stages/[keyStageSlug]/subjects/[subjectSlug]";
import renderWithProviders from "../../../../../../__helpers__/renderWithProviders";
import renderWithSeo from "../../../../../../__helpers__/renderWithSeo";

jest.mock("next/dist/client/router", () => require("next-router-mock"));

const props = {
  curriculumData: teachersKeyStageSubjectTiersFixture(),
};

describe("pages/teachers/key-stages/[keyStageSlug]/subjects/", () => {
  it("Renders title ", () => {
    renderWithProviders(<TierListingPage {...props} />);

    waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Tiers page"
      );
    });
  });

  describe("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo(<TierListingPage {...props} />);

      expect(seo).toEqual({
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title: "Key Stage 4 Maths tiers | NEXT_PUBLIC_SEO_APP_NAME",
        description: "We have resources for tiers: Foundation, Core, Higher",
        ogTitle: "Key Stage 4 Maths tiers | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "We have resources for tiers: Foundation, Core, Higher",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        ogImage:
          "NEXT_PUBLIC_SEO_APP_URLNEXT_PUBLIC_SEO_APP_SOCIAL_SHARING_IMG?2022",
      });
    });
  });

  describe("getStaticPaths", () => {
    it("Should return the paths of all keystages", async () => {
      await getStaticPaths();

      expect(
        curriculumApi.teachersKeyStageSubjectTiersPaths
      ).toHaveBeenCalled();
    });
  });

  describe("getStaticProps", () => {
    it("Should fetch the correct data", async () => {
      await getStaticProps({
        params: { keyStageSlug: "ks123", subjectSlug: "maths" },
      });

      expect(curriculumApi.teachersKeyStageSubjectTiers).toHaveBeenCalledWith({
        keyStageSlug: "ks123",
        subjectSlug: "maths",
      });
    });
  });
});
