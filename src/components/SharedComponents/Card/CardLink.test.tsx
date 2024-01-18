import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import Card from "./Card";
import CardLink from "./CardLink";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { Heading, P } from "@/components/SharedComponents/Typography";

describe("CardLink", () => {
  it("is a link if clicked", async () => {
    renderWithTheme(
      <Card
        $flexDirection={"column"}
        $justifyContent={"center"}
        $alignItems="center"
      >
        <Heading $mt={24} $mb={0} tag={"h5"}>
          <CardLink page={null} href="https://www.test.com">
            Click Me
          </CardLink>
        </Heading>
        <P>
          Drop a CardLink component into a Card and pass in href. The whole card
          becomes a link.
        </P>
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
