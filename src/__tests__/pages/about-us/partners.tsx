import { screen, waitFor } from "@testing-library/react";

import renderWithProviders from "../../__helpers__/renderWithProviders";
import renderWithSeo from "../../__helpers__/renderWithSeo";
import CMSClient, { AboutPartnersPage } from "../../../node-lib/cms";
// import AboutPartners, { getStaticProps } from "../../../pages/about-us/partners";

import { testAboutPageBaseData } from "./who-we-are.test";

jest.mock("../../../node-lib/cms");

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

export const testAboutPartnersPageData: AboutPartnersPage = {
  ...testAboutPageBaseData,
  heading: "Partners",
  introPortableText: [
    {
      _key: "c740fe769b64",
      _type: "block",
      children: [
        {
          _key: "6cc9a2ce3bde0",
          _type: "span",
          marks: [],
          text: "From humble roots, we’ve grown into a national resource, supporting millions of teachers and pupils. It wouldn’t have been possible without the brilliant work of the talented teachers, curriculum partners and technology partners that have supported us. Thank you.",
        },
      ],
      markDefs: [],
      style: "normal",
    },
  ],
  techPartners: [
    {
      asset: {
        _id: "image-060531729f9bc7fc836bdf87b9b80c4995247d5c-158x52-svg",
        url: "https://cdn.sanity.io/images/cuvjke51/feat-about-page/060531729f9bc7fc836bdf87b9b80c4995247d5c-158x52.svg",
      },
      name: "Some tech partner",
    },
  ],
  curriculumPartners: [
    {
      asset: {
        _id: "image-06e8cb0660bed44fd0e139a62ce6ccc6d590c959-300x300-png",
        url: "https://cdn.sanity.io/images/cuvjke51/production/06e8cb0660bed44fd0e139a62ce6ccc6d590c959-300x300.png",
      },
      name: "Some partner",
    },
  ],
};

// Mock implementations  for stubbed tests - replace with real imports
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AboutPartners = (_props: { pageData: unknown }) => <></>;
// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
const getStaticProps = (params: unknown) => {};

describe.skip("pages/about-us/partners.tsx", () => {
  it("Renders correct title ", async () => {
    renderWithProviders(<AboutPartners pageData={testAboutPartnersPageData} />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
        "About us"
      );
    });
  });

  describe.skip("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo(
        <AboutPartners pageData={testAboutPartnersPageData} />
      );

      expect(seo).toEqual({});
    });
  });

  describe("getStaticProps", () => {
    it("should return notFound when the page data is missing", async () => {
      mockCMSClient.aboutPartnersPage.mockResolvedValueOnce(null);

      const propsResult = await getStaticProps({
        params: {},
      });

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
