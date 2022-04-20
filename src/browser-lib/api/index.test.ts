import useApi from ".";

const oakFetchSpy = jest.fn();

jest.mock("./useOakFetch", () => ({
  __esModule: true,
  default: jest.fn(() => oakFetchSpy),
}));

const api = useApi();
describe("browser-lib/api/index", () => {
  it("should have /user method which calls /api/user", () => {
    api["/user"]({ accessToken: "123" });
    expect(oakFetchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/api/user",
      })
    );
  });
});
