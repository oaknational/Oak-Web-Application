import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import { PTExternalLink, PTInternalLink } from "./PortableText";

describe("PortableText", () => {
  describe("PTExternalLink", () => {
    it("renders a link to the provided external href", () => {
      const { getByRole } = renderWithProviders(
        <PTExternalLink
          children={["Some link"]}
          text="Some link"
          markType="link"
          value={{ _type: "link", href: "https://example.com" }}
          renderNode={() => undefined}
        />
      );

      const link = getByRole("link");
      expect(link).toHaveAccessibleName("Some link");
      expect(link).toHaveAttribute("href", "https://example.com");
    });
  });

  describe("PTInternalLink", () => {
    it("renders a link to the provided internal page", () => {
      const { getByRole } = renderWithProviders(
        <PTInternalLink
          children={["Some internal link"]}
          text="Some internal link"
          markType="internalLink"
          value={{
            _type: "internalLink",
            reference: { contentType: "policyPage", slug: "some-policy" },
          }}
          renderNode={() => undefined}
        />
      );

      const link = getByRole("link");
      expect(link).toHaveAccessibleName("Some internal link");
      expect(link).toHaveAttribute("href", "/legal/some-policy");
    });
  });
});
