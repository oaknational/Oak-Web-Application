import { SearchHit } from "../search.types";

import { performSearch } from "./performSearch";
import * as fetchResults2023 from "./2023/fetchResults";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const mockResults2023: SearchHit[] = [{ foo: "bar-2023" }];

jest.mock("./2023/fetchResults", () => ({
  __esModule: true,
  ...jest.requireActual("./2023/fetchResults"),
}));
const fetchResults2023Spy = jest.spyOn(fetchResults2023, "fetchResults");

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
      ...callbacks,
    });
    expect(callbacks.onStart).toHaveBeenCalled();
  });
  test("should call onSuccess with 2023 results on success", async () => {
    fetchResults2023Spy.mockResolvedValue([...mockResults2023]);
    await performSearch({
      query: {
        term: "test",
      },
      ...callbacks,
    });

    expect(callbacks.onSuccess).toHaveBeenCalledWith(
      [...mockResults2023],
      null,
    );
  });
  test("should call onFail on fail", async () => {
    console.log = jest.fn();
    console.error = jest.fn();
    fetchResults2023Spy.mockRejectedValue(new Error("test"));
    await performSearch({
      query: {
        term: "test",
      },
      ...callbacks,
    });
    // TODO: Unsure this should be logging... but this is the current behaviour
    expect(console.log).toHaveBeenCalledWith("search", undefined, undefined);
    expect(console.error).toHaveBeenCalledWith(
      new Error("Search doesn't seem to be working, we're looking into it."),
    );
    expect(callbacks.onFail).toHaveBeenCalled();
  });
});
