import { waitFor } from "@testing-library/react";
import ContactUs from "../../pages/contact-us";
import renderWithProviders from "../__helpers__/renderWithProviders";
import renderWithSeo from "../__helpers__/renderWithSeo";

describe("pages/contact-us.tsx", () => {
  it("contains an h1 ", () => {
    const { getByRole } = renderWithProviders(<ContactUs />);

    expect(getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
  it("contains a sign up button", () => {
    const { getByRole } = renderWithProviders(<ContactUs />);

    expect(
      getByRole("button", {
        name: /sign up/i,
      })
    ).toHaveAccessibleName("Sign up");
  });

  describe("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo(<ContactUs />);

      expect(seo).toEqual({});
    });
  });
});
