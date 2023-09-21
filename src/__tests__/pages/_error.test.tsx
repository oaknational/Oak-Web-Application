import { screen } from "@testing-library/react";

import renderWithProviders from "../__helpers__/renderWithProviders";
import ErrorPage, { getInitialProps } from "../../pages/_error";

const render = renderWithProviders();

describe("pages/_error.tsx", () => {
  it("Renders 404 message ", async () => {
    render(<ErrorPage statusCode={404} />);
    expect(
      screen.getByTestId("errorStatus").querySelector("h1")
    ).toHaveTextContent("404");
  });
  it("Renders 500 message ", async () => {
    render(<ErrorPage statusCode={500} />);
    expect(
      screen.getByTestId("errorStatus").querySelector("h1")
    ).toHaveTextContent("500");
  });

  it("Renders error page with no statusCode ", async () => {
    render(<ErrorPage />);
    expect(
      screen.getByTestId("errorStatus").querySelector("h1")
    ).toHaveTextContent("An error occurred");
  });
  it("contains a button with link to homepage", () => {
    render(<ErrorPage />);

    expect(screen.getByTestId("homeButton").closest("a")).toHaveAttribute(
      "href",
      "/"
    );
  });
  describe("getInitialProps", () => {
    it("Should return 404 with no props", async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const props = getInitialProps({});
      expect(props.statusCode).toBe(404);
    });
    it("Should return 404 with empty object", async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const props = getInitialProps({ res: { statusCode: 505 } });
      expect(props.statusCode).toBe(505);
    });
    it("Should error status code if there is an error object", async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const props = getInitialProps({ err: { statusCode: 500 } });
      expect(props.statusCode).toBe(500);
    });
  });
});
