import { render, screen } from "@testing-library/react";
import mockRouter from "next-router-mock";
import { ReactNode } from "react";

import MyApp from "../../pages/_app";

jest.mock("@apollo/client", () => ({
  __esModule: true,
  ApolloProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));
jest.mock("../../browser-lib/graphql/useApolloClient")
jest.mock("../../hooks/useTheme");
jest.mock("../../hooks/useBookmarks", () => ({
  __esModule: true,
  // ...jest.requireActual("../../hooks/useBookmarks"),
  BookmarksProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));
jest.mock("../../auth/useAuth", () => ({
  __esModule: true,
  // ...jest.requireActual("../../auth/useAuth"),
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
