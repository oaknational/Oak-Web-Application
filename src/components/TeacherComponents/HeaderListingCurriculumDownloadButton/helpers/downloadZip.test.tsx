import { fail } from "node:assert";

import { Mock, afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import downloadZip from "./downloadZip";

const data = { url: "downloadUrlString" };

const successResponse = {
  json: () => Promise.resolve({ data }),
  status: 200,
};

const rejectResponse = {
  json: () => Promise.resolve({ message: "Resource not found" }),
  status: 400,
};

global.fetch = vi.fn(() => Promise.resolve(successResponse)) as Mock;

describe("downloadZip", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() => Promise.resolve(successResponse)) as Mock;
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("should invoke the fetch function when invoked", async () => {
    await downloadZip("4", "maths");

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("it handles rejection by returning error message", async () => {
    vi.spyOn(global, "fetch").mockImplementationOnce((() =>
      Promise.resolve(rejectResponse)) as Mock);
    try {
      await downloadZip("4", "Physics");
      fail("should not reach here");
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toEqual("Resource does not exist");
      } else {
        fail("should not reach here");
      }
    }
  });
});
