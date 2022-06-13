import { render, screen } from "@testing-library/react";
import mockRouter from "next-router-mock";
import { ReactNode } from "react";

import MyApp from "../../pages/_app";

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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <MyApp pageProps={pageProps} Component={Component} router={mockRouter} />
    );

    expect(screen.getByText(/^Test:/).textContent).toBe("Test: value");
  });
});
