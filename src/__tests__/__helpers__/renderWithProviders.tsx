/**
 * A custom render to setup providers. Extends regular
 * render options with `providerProps` to allow injecting
 * different scenarios to test with.
 *
 * @see https://testing-library.com/docs/react-testing-library/setup#custom-render
 */
import React, { FC, ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { MockedProvider as MockedApolloProvider } from "@apollo/client/testing";

import { LessonsBySlugDocument } from "../../data-layer/graphql/generated/apollo";
import { AuthProvider } from "../../auth/useAuth";

const mocks = [
  {
    request: {
      query: LessonsBySlugDocument,
      variables: { slug: "physics-only-review-chj3cd" },
    },
    result: {
      data: {
        lesson: [
          {
            id: 1,
            slug: "physics-only-review-chj3cd",
            title: "Physics only review",
          },
        ],
      },
    },
  },
];
const AllTheProviders: FC = ({ children }) => {
  return (
    <AuthProvider>
      <MockedApolloProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedApolloProvider>
    </AuthProvider>
  );
};

const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export default renderWithProviders;
