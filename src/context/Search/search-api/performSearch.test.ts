import { SearchHit } from "../search.types";

import { performSearch } from "./performSearch";
import * as fetchResults2020 from "./2020/fetchResults";

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
  .mockResolvedValue([...mockResults2020]);

jest.mock("./2023/fetchResults", () => ({
  __esModule: true,
  ...jest.requireActual("./2023/fetchResults"),
}));

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
    await performSearch({
      query: {
        term: "test",
      },
      ...callbacks,
    });

    expect(callbacks.onSuccess).toHaveBeenCalledWith([
      ...mockResults2023,
      ...mockResults2020,
    ]);
  });
  test("should call onFail on fail", async () => {
    fetchResults2020Spy.mockRejectedValue(new Error("test"));
    await performSearch({
      query: {
        term: "test",
      },
      ...callbacks,
    });
    expect(callbacks.onFail).toHaveBeenCalled();
  });
});
