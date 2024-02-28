import { screen } from "@testing-library/react";
import { OakHeading, OakP } from "@oaknational/oak-components";

import Card from "./Card";
import CardLink from "./CardLink";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("CardLink", () => {
  it("is a link if clicked", async () => {
    renderWithTheme(
      <Card
        $flexDirection={"column"}
        $justifyContent={"center"}
        $alignItems="center"
      >
        <OakHeading
          $mt={"space-between-m"}
          $mb={"space-between-none"}
          tag={"h5"}
        >
          <CardLink page={null} href="https://www.test.com">
            Click Me
          </CardLink>
        </OakHeading>
        <OakP>
          Drop a CardLink component into a Card and pass in href. The whole card
          becomes a link.
        </OakP>
      </Card>,
    );

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://www.test.com",
    );
  });
  it("resolves page -> href", async () => {
    renderWithTheme(
      <CardLink page="legal" legalSlug="privacy-policy">
        Click Me
      </CardLink>,
    );

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/legal/privacy-policy",
    );
  });
});
