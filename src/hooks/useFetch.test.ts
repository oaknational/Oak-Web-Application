import { renderHook, waitFor } from "@testing-library/react";
import { uniqueId } from "lodash";

import { useFetch } from "./useFetch";

describe("useFetch()", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("valid", async () => {
    const id = uniqueId("test_");
    const expected = {
      name: "Bob",
      favNumber: 23,
    };
    const fetch = jest.spyOn(global, "fetch") as jest.Mock;
    fetch.mockResolvedValueOnce(
      new Response(JSON.stringify(expected), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );
    const hook = renderHook(() =>
      useFetch<{ name: string; favNumber: number }>(
        "http://localhost:9009?s=" + id,
        "misc/unknown",
      ),
    );

    await waitFor(() => expect(hook.result.current.isLoading).toEqual(false));

    const result = hook.result.current;
    expect(result.error).not.toBeDefined();
    expect(result.data).toEqual(expected);
  });

  test("invalid", async () => {
    const id = uniqueId("test_");
    const fetch = jest.spyOn(global, "fetch") as jest.Mock;
    fetch.mockResolvedValueOnce(
      new Response("{}", {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );
    const hook = renderHook(() =>
      useFetch<{ name: string; favNumber: number }>(
        "http://localhost:9009?s=" + id,
        "misc/unknown",
      ),
    );

    await waitFor(() => expect(hook.result.current.isLoading).toEqual(false));

    const result = hook.result.current;
    expect(result.error).toBeDefined();
    expect(result.error?.message).toEqual("An unknown error has occurred");
    expect(result.error?.code).toEqual("misc/unknown");
  });

  test("thrown", async () => {
    const id = uniqueId("test_");
    const fetch = jest.spyOn(global, "fetch") as jest.Mock;
    fetch.mockRejectedValue(new Error("nope"));
    const hook = renderHook(() =>
      useFetch<{ name: string; favNumber: number }>(
        "http://localhost:9009?s=" + id,
        "misc/unknown",
      ),
    );

    await waitFor(() => expect(hook.result.current.isLoading).toEqual(false));

    const result = hook.result.current;
    expect(result.error).toBeDefined();
    expect(result.error?.message).toEqual("An unknown error has occurred");
    expect(result.error?.code).toEqual("misc/unknown");
  });
});
