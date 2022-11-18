import { gql } from "@apollo/client";
import { renderHook } from "@testing-library/react";
import { createResponse } from "node-mocks-http";

import useApolloClient from "./useApolloClient";

const TestDocument = gql`
  query testQuery {
    user {
      id
    }
  }
`;

const TOKEN_VALUE = "token value";
jest.mock("../../context/Auth/useAccessToken", () => ({
  __esModule: true,
  default: () => [TOKEN_VALUE],
}));
const fetchSpy = jest.fn(async () => {
  const response = createResponse();

  return {
    ...response,
    ok: true,
    text: async () => JSON.stringify({ data: { user: { id: "" } } }),
    json: async () => ({ foo: "bar" }),
  };
});
global.fetch = fetchSpy as jest.Mock;

describe("browser-lib/graphql/useApolloClient.ts", () => {
  it("should call the correct graphql endpoint", async () => {
    const {
      result: { current: newClient },
    } = renderHook(useApolloClient);

    await newClient.query({ query: TestDocument });

    expect(global.fetch).toHaveBeenCalledWith(
      process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
      expect.anything()
    );
  });
  it("should add access token to authorization header", async () => {
    const {
      result: { current: newClient },
    } = renderHook(useApolloClient);

    await newClient.query({ query: TestDocument });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({
          authorization: `Bearer ${TOKEN_VALUE}`,
        }),
      })
    );
  });
});
