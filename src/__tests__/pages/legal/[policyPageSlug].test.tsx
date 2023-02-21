import { screen, waitFor } from "@testing-library/react";

import Policies, {
  PolicyPageProps,
} from "../../../pages/legal/[policyPageSlug]";
import renderWithProviders from "../../__helpers__/renderWithProviders";
import renderWithSeo from "../../__helpers__/renderWithSeo";
import { PolicyPage } from "../../../common-lib/cms-types";

const testPolicyPage: PolicyPage = {
  title: "Privacy Policy",
  id: "5",
  lastUpdatedAt: new Date("2022-12-01"),
  slug: "privacy-policy",
  bodyPortableText: [],
};

const testPolicyPage2: PolicyPage = {
  title: "Terms and conditions",
  id: "6",
  lastUpdatedAt: new Date("2022-12-01"),
  slug: "terms-and-conditions",
  bodyPortableText: [],
};

const testSerializedPolicyPage = {
  ...testPolicyPage,
  lastUpdatedAt: testPolicyPage.lastUpdatedAt.toISOString(),
};

const policyPages = jest.fn(() => [testPolicyPage, testPolicyPage2]);
const policyPageBySlug = jest.fn(() => testPolicyPage);

describe("pages/legal/[policyPageSlug].tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    jest.mock("../../../node-lib/cms", () => ({
      __esModule: true,
      default: {
        policyPages: jest.fn(policyPages),
        policyPageBySlug: jest.fn(policyPageBySlug),
      },
    }));
  });

  describe("PolicyPage", () => {
    it("Renders title from props ", async () => {
      renderWithProviders(<Policies policy={testSerializedPolicyPage} />);

      await waitFor(() => {
        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
          "Privacy Policy"
        );
      });
    });

    it("Formats the last updated at date", async () => {
      renderWithProviders(<Policies policy={testSerializedPolicyPage} />);

      await waitFor(() => {
        const dateElem = screen.getByText(/1 December 2022/);
        expect(dateElem).toBeInTheDocument();
      });
    });

    describe.skip("SEO", () => {
      it("renders the correct SEO details", async () => {
        const { seo } = renderWithSeo(
          <Policies policy={testSerializedPolicyPage} />
        );

        expect(seo).toEqual({});
      });
    });
  });

  describe("getStaticPaths", () => {
    it("Should return the paths of all policy pages", async () => {
      const { getStaticPaths } = await import(
        "../../../pages/legal/[policyPageSlug]"
      );

      const pathsResult = await getStaticPaths();

      expect(pathsResult.paths).toEqual([
        { params: { policyPageSlug: "privacy-policy" } },
        { params: { policyPageSlug: "terms-and-conditions" } },
      ]);
    });
  });

  describe("getStaticProps", () => {
    it("Should fetch the correct policy page", async () => {
      const { getStaticProps } = await import(
        "../../../pages/legal/[policyPageSlug]"
      );
      await getStaticProps({ params: { policyPageSlug: "privacy-policy" } });

      expect(policyPageBySlug).toHaveBeenCalledWith(
        "privacy-policy",
        expect.anything()
      );
    });

    it("Should serialize the policy updated at date to an ISO date", async () => {
      const { getStaticProps } = await import(
        "../../../pages/legal/[policyPageSlug]"
      );
      const propsResult = (await getStaticProps({
        params: { policyPageSlug: "privacy-policy" },
      })) as { props: PolicyPageProps };

      expect(propsResult?.props?.policy).toMatchObject({
        lastUpdatedAt: "2022-12-01T00:00:00.000Z",
      });
    });

    it("should return notFound when a policy page is missing", async () => {
      policyPageBySlug.mockResolvedValueOnce(null as never);

      const { getStaticProps } = await import(
        "../../../pages/legal/[policyPageSlug]"
      );
      const propsResult = (await getStaticProps({
        params: { policyPageSlug: "privacy-policy" },
      })) as { props: PolicyPageProps };

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
