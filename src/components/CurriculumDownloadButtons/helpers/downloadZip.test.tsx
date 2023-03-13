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

global.fetch = jest.fn(() => Promise.resolve(successResponse)) as jest.Mock;

describe("downloadZip", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve(successResponse)) as jest.Mock;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("should invoke the fetch function when invoked", async () => {
    await downloadZip("4", "maths");

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test("it handles rejection by returning error message", async () => {
    jest
      .spyOn(global, "fetch")
      .mockImplementationOnce((() =>
        Promise.resolve(rejectResponse)) as jest.Mock);
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
