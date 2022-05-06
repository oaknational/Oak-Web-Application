import { screen } from "@testing-library/react";

import renderWithProviders from "../__helpers__/renderWithProviders";
import Error from "../../pages/_error";

describe("pages/_error.tsx", () => {
  it("Renders 404 message ", async () => {
    renderWithProviders(<Error statusCode={404} />);
    expect(screen.getByTestId("errorStatus")).toHaveTextContent(
      "An error 404 occurred on server"
    );
  });
  it("Renders 500 message ", async () => {
    renderWithProviders(<Error statusCode={500} />);
    expect(screen.getByTestId("errorStatus")).toHaveTextContent(
      "An error 500 occurred on server"
    );
  });
  it("Renders error page with no statusCode ", async () => {
    renderWithProviders(<Error />);
    expect(screen.getByTestId("errorStatus")).toHaveTextContent(
      "An error occurred on client"
    );
  });
  it("contains a button with link to homepage", () => {
    renderWithProviders(<Error />);

    expect(screen.getByText("Homepage").closest("a")).toHaveAttribute(
      "href",
      "/"
    );
  });
});
