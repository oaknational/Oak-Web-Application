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

vi.mock("./2020/fetchResults", async () => ({
  __esModule: true,
  ...(await vi.importActual("./2020/fetchResults")),
}));
const fetchResults2020Spy = vi
  .spyOn(fetchResults2020, "fetchResults")
  .mockResolvedValue([...mockResults2020]);

vi.mock("./2023/fetchResults", async () => ({
  __esModule: true,
  ...(await vi.importActual("./2023/fetchResults")),
}));
const fetchResults2023Spy = vi.spyOn(fetchResults2023, "fetchResults");

const callbacks = {
  onStart: vi.fn(),
  onSuccess: vi.fn(),
  onFail: vi.fn(),
};

describe("performSearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test("should call onStart on start", () => {
    fetchResults2023Spy.mockResolvedValue([...mockResults2023]);
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

    expect(callbacks.onSuccess).toHaveBeenCalledWith([
      ...mockResults2023,
      ...mockResults2020,
    ]);
  });
  test("should call onFail on fail", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
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
