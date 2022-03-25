import { render, screen } from "@testing-library/react";
import mockRouter from "next-router-mock";

import MyApp from "../../pages/_app";

jest.mock("../../hooks/useTheme");

describe("<MyApp>", () => {
  it("Renders Component", () => {
    const Component = () => {
      return <div>Test: value</div>;
    };
    const pageProps = {};

    render(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <MyApp pageProps={pageProps} Component={Component} router={mockRouter} />
    );

    expect(screen.getByText(/^Test:/).textContent).toBe("Test: value");
  });
});
