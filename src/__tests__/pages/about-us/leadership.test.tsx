import { screen } from "@testing-library/react";

import renderWithProviders from "../../__helpers__/renderWithProviders";
import renderWithSeo from "../../__helpers__/renderWithSeo";
import CMSClient from "../../../node-lib/cms";
import { AboutLeadershipPage } from "../../../common-lib/cms-types";
import { portableTextFromString } from "../../__helpers__/cms";

import { testAboutPageBaseData } from "./about-us.fixtures";

jest.mock("../../../node-lib/cms");

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

const testAboutLeadershipPageData: AboutLeadershipPage = {
  ...testAboutPageBaseData,
  heading: "Leadership",
  introPortableText: portableTextFromString("text"),
};

// Mock implementations  for stubbed tests - replace with real imports
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AboutLeadership = (_props: { pageData: unknown }) => <></>;
// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
const getStaticProps = (params: unknown) => {};

describe.skip("pages/about-us/leadership.tsx", () => {
  it("Renders correct title ", async () => {
    renderWithProviders(
      <AboutLeadership pageData={testAboutLeadershipPageData} />
    );

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "About us"
    );
  });

  describe("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo(
        <AboutLeadership pageData={testAboutLeadershipPageData} />
      );

      expect(seo).toEqual({});
    });
  });

  describe("getStaticProps", () => {
    it("should return notFound when the page data is missing", async () => {
      mockCMSClient.aboutLeadershipPage.mockResolvedValueOnce(null);

      const propsResult = await getStaticProps({
        params: {},
      });

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
