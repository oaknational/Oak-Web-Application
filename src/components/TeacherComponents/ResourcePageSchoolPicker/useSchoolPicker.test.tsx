import { act, renderHook } from "@testing-library/react";

import useSchoolPicker, { fetcher } from "./useSchoolPicker";

import OakError from "@/errors/OakError";

const mockUseSWR = vi.fn<{ data: unknown; error: unknown }, []>(() => ({
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

vi.mock("swr", () => ({
  __esModule: true,
  default: (...args: []) => mockUseSWR(...args),
}));

const reportError = vi.fn();

vi.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      reportError(...args),
}));

const fetch = vi.spyOn(global, "fetch") as vi.Mock;

describe("useSchoolPicker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });
  test("Schools should be returned with homeschool option if fetch succeeds", async () => {
    const { result, rerender } = renderHook(useSchoolPicker);
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
  test("Schools not returned if fetch succeeds but searchterm.length < 2", async () => {
    mockUseSWR.mockImplementationOnce(() => ({
      data: data,
      error: null,
    }));
    const { result } = renderHook(() => useSchoolPicker());

    expect(result.current.schools).toEqual([]);
  });
  test("should throw an error if failed to fetch school ", async () => {
    fetch.mockResolvedValue({
      json: vi.fn().mockResolvedValue({ res: "this" }),
      ok: false,
      status: 401,
      statusText: "Not Found",
    });
    await expect(
      async () => await fetcher("https://school-picker/value"),
    ).rejects.toThrowError(
      new OakError({ code: "school-picker/fetch-suggestions" }),
    );
    expect(reportError).toBeCalled();
  });
  test("should return and empty array with no data ", async () => {
    fetch.mockResolvedValue({
      json: vi.fn().mockResolvedValue({ res: undefined }),
      ok: true,
      status: 404,
      statusText: "Not Found",
    });

    const { result } = renderHook(() => useSchoolPicker());

    expect(result.current.schools).toEqual([]);
  });
});
