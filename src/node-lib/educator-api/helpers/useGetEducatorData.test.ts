import { renderHook } from "@testing-library/react";

import { useGetEducatorData } from "./useGetEducatorData";

const mockUseSWR = jest.fn<{ data: unknown; error: unknown }, []>(() => ({
  data: null,
  error: null,
}));

const data = [
  "counting-from-1-to-10",
  "tens-and-ones",
  "multiplication-tables",
];

jest.mock("swr", () => ({
  __esModule: true,
  default: (...args: []) => mockUseSWR(...args),
}));

jest.mock("@/node-lib/educator-api/helpers/useGetEducatorData", () =>
  jest.requireActual("@/node-lib/educator-api/helpers/useGetEducatorData"),
);

describe("useGetEducatorData", () => {
  it("should return data", () => {
    mockUseSWR.mockImplementationOnce(() => ({
      data,
      error: null,
    }));
    const { result } = renderHook(() => useGetEducatorData("url"));
    expect(result.current.data).toEqual(data);
  });
  it("should return an error", () => {
    const error = new Error("Error fetching data");
    mockUseSWR.mockImplementationOnce(() => ({
      data: null,
      error,
    }));
    const { result } = renderHook(() => useGetEducatorData("url"));
    expect(result.current.error).toEqual(error);
  });
});
