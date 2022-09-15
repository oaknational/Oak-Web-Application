import { render, screen } from "@testing-library/react";
import mockRouter from "next-router-mock";
import { ReactNode } from "react";

import MyApp from "../../pages/_app";

const noopAvoLogger = {
  logDebug: () => true,
  logWarn: () => true,
  // returning false will make avo use console errors, which
  // we may prefer for actual errors
  logError: () => false,
};

jest.mock("@apollo/client", () => ({
  __esModule: true,
  ApolloProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));
jest.mock("../../browser-lib/graphql/useApolloClient");
jest.mock("../../hooks/useOakTheme", () => ({
  __esModule: true,
  default: () => ({
    name: "default",
    theme: {},
  }),
}));
jest.mock("../../context/Bookmarks", () => ({
  __esModule: true,
  BookmarksProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));
jest.mock("../../context/Auth", () => ({
  __esModule: true,
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

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
      />
    );

    expect(screen.getByText(/^Test:/).textContent).toBe("Test: value");
  });
});
