import { render, screen } from "@testing-library/react";
import mockRouter from "next-router-mock";

import MyApp from "../../pages/_app";

console.info = jest.fn();

const noopAvoLogger = {
  logDebug: () => true,
  logWarn: () => true,
  // returning false will make avo use console errors, which
  // we may prefer for actual errors
  logError: () => false,
};

jest.mock("../../hooks/useOakTheme", () => ({
  __esModule: true,
  default: () => ({
    name: "default",
    theme: {},
  }),
}));

jest.mock("next/dist/client/router", () => require("next-router-mock"));

describe("<MyApp>", () => {
  it("Renders Component", () => {
    const Component = () => {
      return <div>Test: value</div>;
    };
    const pageProps = {};

    render(
      <MyApp
        pageProps={pageProps}
        Component={Component}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        router={mockRouter}
        analyticsOptions={{ avoOptions: { avoLogger: noopAvoLogger } }}
      />,
    );

    expect(console.info).toHaveBeenCalledWith(
      "No HubSpot cookie found, user likely has not interacted with HubSpot",
    );
    expect(screen.getByText(/^Test:/).textContent).toBe("Test: value");
  });
});
