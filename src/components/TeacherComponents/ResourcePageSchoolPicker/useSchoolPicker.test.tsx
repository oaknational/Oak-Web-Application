import { act, renderHook } from "@testing-library/react";

import useSchoolPicker, { fetcher } from "./useSchoolPicker";

import OakError from "@/errors/OakError";

const mockUseSWR = jest.fn<{ data: unknown; error: unknown }, []>(() => ({
  data: null,
  error: null,
}));

const data = [
  {
    urn: "101105",
    la: "Westminster",
    name: "Bricks Nursery School",
    postcode: "AB1 2CD",
  },
  {
    urn: "101188",
    la: "Barking and Dagenham",
    name: "Woodland Infants' School",
    postcode: "AB1 2CD",
  },
];

jest.mock("swr", () => ({
  __esModule: true,
  default: (...args: []) => mockUseSWR(...args),
}));

const reportError = jest.fn();

jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      reportError(...args),
}));

const fetch = jest.spyOn(global, "fetch") as jest.Mock;

describe("useSchoolPicker", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });
  test("Schools should be returned with homeschool option if fetch succeeds", async () => {
    const { result, rerender } = renderHook(() =>
      useSchoolPicker({ withHomeschool: true }),
    );
    act(() => result.current.setSchoolPickerInputValue("wes"));
    mockUseSWR.mockImplementationOnce(() => ({
      data: data,
      error: null,
    }));
    rerender();
    expect(result.current.schools).toEqual([
      ...data,
      {
        name: "Homeschool",
        urn: "homeschool",
      },
    ]);
  });
  it("Schools not include homeschool if flag is false", () => {
    const { result, rerender } = renderHook(() =>
      useSchoolPicker({ withHomeschool: false }),
    );
    act(() => result.current.setSchoolPickerInputValue("wes"));
    mockUseSWR.mockImplementationOnce(() => ({
      data: data,
      error: null,
    }));
    rerender();
    expect(result.current.schools).toEqual(data);
  });
  test("Schools not returned if fetch succeeds but searchterm.length < 2", async () => {
    mockUseSWR.mockImplementationOnce(() => ({
      data: data,
      error: null,
    }));
    const { result } = renderHook(() =>
      useSchoolPicker({ withHomeschool: false }),
    );
    expect(result.current.schools).toEqual([]);
  });
  test("should throw an error if failed to fetch school ", async () => {
    const mockJson = jest.fn().mockResolvedValue({ res: "this" });
    fetch.mockResolvedValue({
      json: mockJson,
      ok: false,
      status: 401,
      statusText: "Not Found",
    });
    await expect(
      async () => await fetcher("https://school-picker/value"),
    ).rejects.toThrowError(
      new OakError({ code: "school-picker/fetch-suggestions" }),
    );
    expect(mockJson).toBeCalled();
    expect(reportError).toBeCalled();
  });
  test("should return and empty array with no data ", async () => {
    fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ res: undefined }),
      ok: true,
      status: 404,
      statusText: "Not Found",
    });

    const { result } = renderHook(() =>
      useSchoolPicker({ withHomeschool: true }),
    );

    expect(result.current.schools).toEqual([]);
  });
});
