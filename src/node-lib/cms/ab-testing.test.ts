import { GetServerSidePropsContext } from "next";
import { PostHog } from "posthog-node";
import { sample } from "lodash/fp";

import { LandingPage } from "../../common-lib/cms-types";
import { ABTestedLandingPage } from "../../common-lib/cms-types/abTest";

import { getABTestedLandingPage } from "./ab-testing";

import CMSClient from ".";

jest.mock("./");
jest.mock("lodash/fp");
jest.mock("posthog-node");

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

const testLandingPage = {} as LandingPage;
const control = { ...testLandingPage, slug: "ab-tested-page-control" };
const variantA = { ...testLandingPage, slug: "ab-tested-page-variant-a" };
const variantB = { ...testLandingPage, slug: "ab-tested-page-variant-b" };

const testABTestedLandingPage: ABTestedLandingPage = {
  id: "01",
  slug: "ab-tested-page",
  posthogFeatureFlagKey: "my-experiment",
  controlVariant: control,
  variants: [
    {
      posthogVariant: "variant-a",
      page: variantA,
    },
    {
      posthogVariant: "variant-b",
      page: variantB,
    },
  ],
};

describe("ab-testing", () => {
  describe("getABTestedLandingPage", () => {
    beforeEach(() => {
      mockCMSClient.landingPageABTestBySlug.mockResolvedValue(
        testABTestedLandingPage,
      );
    });

    it("returns the assigned variant's page data for identified users", async () => {
      const cookies = {
        ph_NEXT_PUBLIC_POSTHOG_API_KEY_posthog: `{"distinct_id": "my_distinct_id"}`,
      };
      const context = {
        req: { cookies },
      } as unknown as GetServerSidePropsContext;

      const posthogInstance = (PostHog as jest.Mock<PostHog>).mock.instances[0];
      (posthogInstance?.getFeatureFlag as jest.Mock).mockResolvedValue(
        "variant-b",
      );

      const pageVariant = await getABTestedLandingPage(
        "ab-tested-page",
        context,
        false,
      );

      expect(pageVariant).toBe(variantB);
    });

    it("returns a random variant for anonymous users", async () => {
      const context = {
        req: { cookies: {} },
      } as unknown as GetServerSidePropsContext;

      const pageVariant = await getABTestedLandingPage(
        "ab-tested-page",
        context,
        false,
      );

      expect(sample).toBeCalledWith([control, variantA, variantB]);

      // The random value returned from sample()
      const sampledResult = (sample as jest.Mock).mock.results?.[0]?.value;
      expect(pageVariant).toBe(sampledResult);
    });
  });
});
