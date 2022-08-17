import useApi from ".";

const oakFetchSpy = jest.fn();

jest.mock("./useOakFetch", () => ({
  __esModule: true,
  default: jest.fn(() => oakFetchSpy),
}));

describe("browser-lib/api/index", () => {
  it("should have /user method which calls /api/user", () => {
    const api = useApi();
    api["/user"]({ accessToken: "123" });
    expect(oakFetchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/api/user",
      })
    );
  });
});
