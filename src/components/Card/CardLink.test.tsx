import { screen } from "@testing-library/react";

import { Heading, P } from "../Typography";
import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import Card from "./Card";
import CardLink from "./CardLink";

describe("CardLink", () => {
  it("is a link if clicked", async () => {
    renderWithProviders(
      <Card
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems="center"
      >
        <Heading mt={24} mb={0} fontSize={24} tag={"h5"}>
          <CardLink href="https://www.test.com">Click Me</CardLink>
        </Heading>
        <P>
          Drop a CardLink component into a Card and pass in href. The whole card
          becomes a link.
        </P>
      </Card>
    );

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://www.test.com"
    );
  });
});
