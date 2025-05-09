import { postEducatorData } from "./postEducatorData";

describe("postEducatorData", () => {
  const url = "https://example.com/api/educator-data";
  const mockResponse = { data: "mockData" };
  const mockFetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = mockFetch;
  });

  it("should post data successfully", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    await postEducatorData(url);

    expect(mockFetch).toHaveBeenCalledWith(url, { method: "POST" });
  });

  it("should handle error and call onErr callback", async () => {
    const onErrMock = jest.fn();
    const errorResponse = { status: 500, statusText: "Internal Server Error" };

    mockFetch.mockResolvedValueOnce({
      ok: false,
      ...errorResponse,
      json: jest.fn(),
    });

    await postEducatorData(url, onErrMock);

    expect(mockFetch).toHaveBeenCalledWith(url, { method: "POST" });
    expect(onErrMock).toHaveBeenCalled();
  });
});
