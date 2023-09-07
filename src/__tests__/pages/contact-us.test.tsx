import CMSClient from "../../node-lib/cms";
import { ContactPage } from "../../common-lib/cms-types";
import ContactUs, { getStaticProps } from "../../pages/contact-us";
import {
  portableTextFromString,
  mockSeo,
  mockSeoResult,
} from "../__helpers__/cms";
import renderWithProviders from "../__helpers__/renderWithProviders";
import renderWithSeo from "../__helpers__/renderWithSeo";

const testContactPageData: ContactPage = {
  id: "01",
  title: "Contact title",
  heading: "Contact heading",
  summaryPortableText: portableTextFromString("Contact summary"),
  bodyPortableText: portableTextFromString("Intro summary"),
  seo: mockSeo(),
};

jest.mock("../../node-lib/cms");

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

const render = renderWithProviders();

describe("pages/contact-us.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("contains an h1 ", () => {
    const { getByRole } = render(<ContactUs pageData={testContactPageData} />);

    expect(getByRole("heading", { level: 1 })).toHaveTextContent(
      "Contact title",
    );
  });

  it("contains a sign up button", () => {
    const { getByRole } = render(<ContactUs pageData={testContactPageData} />);

    expect(
      getByRole("button", {
        name: /sign up/i,
      }),
    ).toHaveAccessibleName("Sign up");
  });

  describe("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo()(
        <ContactUs pageData={testContactPageData} />,
      );

      expect(seo).toEqual({ ...mockSeoResult });
    });
  });

  describe("getStaticProps", () => {
    it("Should not fetch draft content by default", async () => {
      await getStaticProps({
        params: {},
      });

      expect(mockCMSClient.contactPage).toHaveBeenCalledWith({
        previewMode: false,
      });
    });

    it("should return notFound when the page data is missing", async () => {
      mockCMSClient.contactPage.mockResolvedValueOnce(null);

      const propsResult = await getStaticProps({
        params: {},
      });

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });

    it("should return notFound when the page data is missing", async () => {
      mockCMSClient.contactPage.mockResolvedValueOnce(null);

      const propsResult = await getStaticProps({
        params: {},
      });

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });

    it("unhandled errors are rethrown (not swallowed)", async () => {
      // eslint-disable-next-line
      // @ts-ignore
      expect(getStaticProps()).rejects.toThrow("properties of undefined");
    });
  });
});
