import { screen } from "@testing-library/react";

import renderWithProviders from "../__helpers__/renderWithProviders";
import ErrorPage, { getInitialProps } from "../../pages/_error";

describe("pages/_error.tsx", () => {
  it("Renders 404 message ", async () => {
    renderWithProviders(<ErrorPage statusCode={404} />);
    expect(screen.getByTestId("errorStatus")).toHaveTextContent(
      "An error 404 occurred on server"
    );
  });
  it("Renders 500 message ", async () => {
    renderWithProviders(<ErrorPage statusCode={500} />);
    expect(screen.getByTestId("errorStatus")).toHaveTextContent(
      "An error 500 occurred on server"
    );
  });

  it("Renders error page with no statusCode ", async () => {
    renderWithProviders(<ErrorPage />);
    expect(screen.getByTestId("errorStatus")).toHaveTextContent(
      "An error occurred on client"
    );
  });
  it("contains a button with link to homepage", () => {
    renderWithProviders(<ErrorPage />);

    expect(screen.getByText("Homepage").closest("a")).toHaveAttribute(
      "href",
      "/"
    );
  });
  describe("getStaticProps", () => {
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
