/**
 * A custom render to setup providers. Extends regular
 * render options with `providerProps` to allow injecting
 * different scenarios to test with.
 *
 * @see https://testing-library.com/docs/react-testing-library/setup#custom-render
 */
import React, { FC } from "react";
import { render } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";

import { LessonsBySlugDocument } from "../../data-layer/graphql/generated/apollo";

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
    <MockedProvider mocks={mocks} addTypename={false}>
      {children}
    </MockedProvider>
  );
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const renderWithProviders: typeof render = (
  ui: Parameters<typeof render>[0],
  options: Parameters<typeof render>[1]
) => render(ui, { wrapper: AllTheProviders, ...options });

export default renderWithProviders;
