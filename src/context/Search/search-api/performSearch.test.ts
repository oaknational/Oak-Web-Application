import { SearchHit } from "../search.types";

import { performSearch } from "./performSearch";
import * as fetchResults2020 from "./2020/fetchResults";
import * as fetchResults2023 from "./2023/fetchResults";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const mockResults2020: SearchHit[] = [{ foo: "bar-2020" }];
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const mockResults2023: SearchHit[] = [{ foo: "bar-2023" }];

jest.mock("./2020/fetchResults", () => ({
  __esModule: true,
  ...jest.requireActual("./2020/fetchResults"),
}));
const fetchResults2020Spy = jest
  .spyOn(fetchResults2020, "fetchResults")
  .mockResolvedValue([]);
jest.mock("./2023/fetchResults", () => ({
  __esModule: true,
  ...jest.requireActual("./2023/fetchResults"),
}));
const fetchResults2023Spy = jest
  .spyOn(fetchResults2023, "fetchResults")
  .mockResolvedValue([]);

const callbacks = {
  onStart: jest.fn(),
  onSuccess: jest.fn(),
  onFail: jest.fn(),
};

describe("performSearch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("should call onStart on start", () => {
    performSearch({
      query: {
        term: "test",
      },
      apiVersion: "2020",
      ...callbacks,
    });
    expect(callbacks.onStart).toHaveBeenCalled();
  });
  test("should call onSuccess with 2020 results on success", async () => {
    fetchResults2020Spy.mockResolvedValue(mockResults2020);
    await performSearch({
      query: {
        term: "test",
      },
      apiVersion: "2020",
      ...callbacks,
    });
    expect(callbacks.onSuccess).toHaveBeenCalledWith(mockResults2020);
  });
  test("should call onSuccess with 2023 results on success", async () => {
    fetchResults2023Spy.mockResolvedValue(mockResults2023);
    await performSearch({
      query: {
        term: "test",
      },
      apiVersion: "2023",
      ...callbacks,
    });
    expect(callbacks.onSuccess).toHaveBeenCalledWith(mockResults2023);
  });
  test("should call onFail on fail", async () => {
    fetchResults2020Spy.mockRejectedValue(new Error("test"));
    await performSearch({
      query: {
        term: "test",
      },
      apiVersion: "2020",
      ...callbacks,
    });
    expect(callbacks.onFail).toHaveBeenCalled();
  });
  test("should call both 2020 and 2023 data sets", async () => {
    fetchResults2020Spy.mockResolvedValue(mockResults2020);
    fetchResults2023Spy.mockResolvedValue(mockResults2023);
    await performSearch({
      query: {
        term: "test",
      },
      apiVersion: "2020",
      ...callbacks,
    });
    expect(fetchResults2020Spy).toHaveBeenCalled();
    expect(fetchResults2023Spy).toHaveBeenCalled();
  });
});
